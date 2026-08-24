import { Update, Ctx, Start, Help, On, Command } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { createClient } from '@sanity/client';
import axios from 'axios';

// Simple in-memory state for adding a product
interface AddProductState {
  step: 'IDLE' | 'AWAITING_NAME' | 'AWAITING_PRICE' | 'AWAITING_CATEGORY' | 'AWAITING_SIZES' | 'AWAITING_DESCRIPTION' | 'AWAITING_PHOTO';
  name?: string;
  price?: number;
  categoryName?: string;
  sizes?: string[];
  description?: string;
}

@Update()
@Injectable()
export class BotUpdate {
  private readonly logger = new Logger(BotUpdate.name);
  private userStates: Map<number, AddProductState> = new Map();
  private sanityClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.sanityClient = createClient({
      projectId: this.configService.get<string>('NEXT_PUBLIC_SANITY_PROJECT_ID') || 'dummyId123',
      dataset: this.configService.get<string>('NEXT_PUBLIC_SANITY_DATASET') || 'production',
      useCdn: false,
      apiVersion: '2023-05-03',
      token: this.configService.get<string>('SANITY_API_TOKEN'),
    });
  }

  private isAdmin(ctx: Context): boolean {
    const adminIds = this.configService.get<string>('TELEGRAM_ADMIN_CHAT_ID')?.split(',').map(id => id.trim()) || [];
    return adminIds.includes(ctx.from?.id.toString() || '');
  }

  @Start()
  async start(@Ctx() ctx: Context) {
    if (!this.isAdmin(ctx)) {
      await ctx.reply('Ви не маєте доступу до цього бота.');
      return;
    }
    await ctx.reply('Привіт, Адмін! Я готовий приймати замовлення.\n\nКоманди:\n/addproduct - Додати новий товар');
  }

  @Command('addproduct')
  async onAddProduct(@Ctx() ctx: Context) {
    if (!this.isAdmin(ctx)) return;

    this.userStates.set(ctx.from!.id, { step: 'AWAITING_NAME' });
    await ctx.reply('Давай додамо товар! Напиши назву товару (наприклад: "Vintage Hoodie"):');
  }

  @On('text')
  async onMessage(@Ctx() ctx: Context) {
    if (!this.isAdmin(ctx)) return;
    
    // @ts-ignore
    const text = ctx.message?.text;
    if (!text) return;

    const state = this.userStates.get(ctx.from!.id);
    if (!state || state.step === 'IDLE') return;

    switch (state.step) {
      case 'AWAITING_NAME':
        state.name = text;
        state.step = 'AWAITING_PRICE';
        await ctx.reply(`Назва: ${state.name}\nТепер введи ціну (тільки цифри, наприклад: 1500):`);
        break;
      case 'AWAITING_PRICE':
        const price = parseFloat(text);
        if (isNaN(price)) {
          await ctx.reply('Будь ласка, введи коректну ціну цифрами.');
          return;
        }
        state.price = price;
        state.step = 'AWAITING_CATEGORY';
        
        const categories = await this.prisma.category.findMany();
        const catNames = categories.map(c => c.name).join(', ');
        await ctx.reply(`Ціна: ${state.price} UAH\nВибери категорію (Наявні: ${catNames}):`);
        break;
      case 'AWAITING_CATEGORY':
        state.categoryName = text;
        state.step = 'AWAITING_SIZES';
        await ctx.reply(`Категорія: ${state.categoryName}\nТепер введи розміри через кому (наприклад: S, M, L, XL):`);
        break;
      case 'AWAITING_SIZES':
        state.sizes = text.split(',').map(s => s.trim());
        state.step = 'AWAITING_DESCRIPTION';
        await ctx.reply(`Розміри: ${state.sizes.join(', ')}\nТепер напишіть опис товару (текст):`);
        break;
      case 'AWAITING_DESCRIPTION':
        state.description = text;
        state.step = 'AWAITING_PHOTO';
        await ctx.reply(`Опис збережено!\nСупер! Залишилося лише відправити фото товару (надішли одне фото).`);
        break;
    }
  }

  @On('photo')
  async onPhoto(@Ctx() ctx: Context) {
    if (!this.isAdmin(ctx)) return;

    const state = this.userStates.get(ctx.from!.id);
    if (!state || state.step !== 'AWAITING_PHOTO') return;

    // @ts-ignore
    const photos = ctx.message?.photo;
    if (!photos) return;

    await ctx.reply('Оброблюю фото та створюю товар у Sanity та БД... Зачекай.');

    try {
      // Get highest resolution photo
      const photo = photos[photos.length - 1];
      const fileId = photo.file_id;
      const fileUrl = await ctx.telegram.getFileLink(fileId);
      
      // Upload to Sanity
      const imageResponse = await axios.get(fileUrl.href, { responseType: 'arraybuffer' });
      const sanityImageAsset = await this.sanityClient.assets.upload('image', imageResponse.data, {
        filename: `${state.name}.jpg`,
      });

      // Find Category
      let category = await this.prisma.category.findFirst({ where: { name: { equals: state.categoryName, mode: 'insensitive' } } });
      if (!category) {
        category = await this.prisma.category.findFirst(); // fallback to first category if not found
      }
      if (!category) throw new Error("Немає категорій в БД");

      // Generate Sanity ID
      const sanityId = `product-${Date.now()}`;
      
      // Create product in Prisma
      const newProduct = await this.prisma.product.create({
        data: {
          name: state.name!,
          price: state.price!,
          description: "Товар додано з Telegram",
          sizes: state.sizes!,
          categoryId: category.id,
          images: [sanityImageAsset.url],
          sanityId: sanityId,
          slug: state.name!.toLowerCase().replace(/\s+/g, '-'),
        }
      });

      // Attempt to create in Sanity
      try {
        await this.sanityClient.create({
          _type: 'product',
          _id: sanityId,
          name: newProduct.name,
          slug: { _type: 'slug', current: newProduct.slug },
          price: Number(newProduct.price),
          images: [{
            _type: 'image',
            asset: { _type: 'reference', _ref: sanityImageAsset._id }
          }],
          sizes: newProduct.sizes,
        });
      } catch (e) {
        this.logger.error("Error creating in Sanity", e);
      }

      await ctx.reply(`✅ Товар успішно додано!\nНазва: ${newProduct.name}\nЦіна: ${newProduct.price} UAH\nSanity URL: ${sanityImageAsset.url}`);
      this.userStates.delete(ctx.from!.id);
    } catch (e) {
      this.logger.error(e);
      await ctx.reply('Сталася помилка при створенні товару.');
      this.userStates.delete(ctx.from!.id);
    }
  }
}
