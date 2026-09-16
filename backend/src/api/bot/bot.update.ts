import { Update, Ctx, Start, Help, Command, Action, Hears } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

const MAIN_KEYBOARD = {
  keyboard: [
    [{ text: '📦 Останні замовлення' }, { text: '📊 Статистика' }],
    [{ text: '🛍 Каталог товарів' }, { text: 'ℹ️ Довідка' }],
  ],
  resize_keyboard: true,
};

@Update()
@Injectable()
export class BotUpdate {
  private readonly logger = new Logger(BotUpdate.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  private isAdmin(ctx: Context): boolean {
    const adminIds = this.configService.get<string>('TELEGRAM_ADMIN_CHAT_ID')?.split(',').map(id => id.trim()) || [];
    return adminIds.includes(ctx.from?.id.toString() || '');
  }

  // --- /start, /menu, 🏠 Меню ---
  @Start()
  async start(@Ctx() ctx: Context) {
    if (!this.isAdmin(ctx)) {
      await ctx.reply('⛔ У вас немає доступу до панелі адміністратора Holy Drip.');
      return;
    }

    const name = ctx.from?.first_name || 'Адмін';

    const text = `👑 <b>Вітаємо, ${name}!</b>
Панель керування магазином <b>Holy Drip</b>.

Бот синхронізований із сайтом і готовий приймати сповіщення про замовлення в реальному часі.

<b>📋 Доступні команди:</b>
📦 <b>/orders</b> — Останні замовлення сайту та зміна статусів
📊 <b>/stats</b> — Фінансова аналітика та підсумки продажів
🛍 <b>/products</b> — Каталог товарів магазину
ℹ️ <b>/help</b> — Інструкція та керування статусами

<i>Оберіть потрібну дію на панелі нижче 👇</i>`;

    await ctx.reply(text, {
      parse_mode: 'HTML',
      reply_markup: MAIN_KEYBOARD,
    });
  }

  @Command('menu')
  async onMenu(@Ctx() ctx: Context) {
    await this.start(ctx);
  }

  @Hears('🏠 Меню')
  async onMenuHears(@Ctx() ctx: Context) {
    await this.start(ctx);
  }

  // --- /orders & 📦 Останні замовлення ---
  @Command('orders')
  async onOrders(@Ctx() ctx: Context) {
    if (!this.isAdmin(ctx)) return;

    try {
      const orders = await this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: { product: true }
          }
        }
      });

      if (!orders || orders.length === 0) {
        await ctx.reply('📦 <b>Замовлень поки немає.</b>\nЩойно клієнт оформить покупку на сайті, сповіщення надійде сюди автоматично!', {
          parse_mode: 'HTML',
          reply_markup: MAIN_KEYBOARD,
        });
        return;
      }

      const statusMap: Record<string, string> = {
        PENDING: '⏳ Очікує оплати',
        PAID: '💳 Оплачено',
        CONFIRMED: '✅ Підтверджено',
        SHIPPED: '🚚 Відправлено',
        FAILED: '❌ Скасовано',
      };

      let msg = `📦 <b>Останні ${orders.length} замовлень сайту:</b>\n\n`;

      for (let i = 0; i < orders.length; i++) {
        const o = orders[i];
        const shortId = o.id.slice(0, 8);
        const dateStr = new Date(o.createdAt).toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' });
        const st = statusMap[o.status] || o.status;
        const tgLink = o.telegram ? (o.telegram.startsWith('@') ? o.telegram : `@${o.telegram}`) : '—';
        
        const itemsSummary = o.items.map(it => `  • ${it.product?.name || 'Товар'} (${it.size}) × ${it.quantity} — ${it.price} ₴`).join('\n');

        msg += `<b>${i + 1}. Замовлення #${shortId}</b> (${dateStr})\n`;
        msg += `👤 <b>Клієнт:</b> ${o.name} | 📱 <code>${o.phone}</code> | 💬 ${tgLink}\n`;
        if (o.address) {
          msg += `📍 <b>Адреса:</b> ${o.address}\n`;
        }
        msg += `📌 <b>Статус:</b> <b>${st}</b>\n`;
        msg += `🛒 <b>Склад:</b>\n${itemsSummary || '  —'}\n`;
        msg += `💰 <b>Разом:</b> <b>${o.totalPrice} ₴</b>\n\n`;
      }

      // For the most recent order, attach interactive status buttons
      const latest = orders[0];
      const latestStatus = latest.status as string;
      const keyboard = {
        inline_keyboard: [
          [
            { text: latestStatus === 'PAID' ? '• Оплачено •' : '💳 Оплачено', callback_data: `status:${latest.id}:PAID` },
            { text: latestStatus === 'CONFIRMED' ? '• Підтверджено •' : '✅ Підтвердити', callback_data: `status:${latest.id}:CONFIRMED` }
          ],
          [
            { text: latestStatus === 'SHIPPED' ? '• Відправлено •' : '🚚 Відправлено', callback_data: `status:${latest.id}:SHIPPED` },
            { text: latestStatus === 'FAILED' ? '• Скасовано •' : '❌ Скасувати', callback_data: `status:${latest.id}:FAILED` }
          ]
        ]
      };

      msg += `<i>Швидкі дії для крайнього замовлення (#${latest.id.slice(0, 8)}):</i>`;

      await ctx.reply(msg, {
        parse_mode: 'HTML',
        reply_markup: keyboard,
      });
    } catch (e: any) {
      this.logger.error('Error fetching orders:', e);
      await ctx.reply(`❌ Помилка при отриманні замовлень: ${e.message}`);
    }
  }

  @Hears('📦 Останні замовлення')
  async onOrdersHears(@Ctx() ctx: Context) {
    await this.onOrders(ctx);
  }

  @Hears('📦 Замовлення')
  async onOrdersHearsShort(@Ctx() ctx: Context) {
    await this.onOrders(ctx);
  }

  // --- /stats & 📊 Статистика ---
  @Command('stats')
  async onStats(@Ctx() ctx: Context) {
    if (!this.isAdmin(ctx)) return;

    try {
      const orders = await this.prisma.order.findMany();
      const usersCount = await this.prisma.user.count();
      const productsCount = await this.prisma.product.count();

      const totalOrders = orders.length;
      const paidOrders = orders.filter(o => (o.status as string) === 'PAID');
      const confirmedOrders = orders.filter(o => (o.status as string) === 'CONFIRMED');
      const shippedOrders = orders.filter(o => (o.status as string) === 'SHIPPED');
      const pendingOrders = orders.filter(o => (o.status as string) === 'PENDING');
      const failedOrders = orders.filter(o => (o.status as string) === 'FAILED');

      const sumPaid = paidOrders.reduce((s, o) => s + Number(o.totalPrice), 0);
      const sumConfirmed = confirmedOrders.reduce((s, o) => s + Number(o.totalPrice), 0);
      const sumShipped = shippedOrders.reduce((s, o) => s + Number(o.totalPrice), 0);
      const sumSuccessful = sumPaid + sumConfirmed + sumShipped;

      const sumPending = pendingOrders.reduce((s, o) => s + Number(o.totalPrice), 0);

      const msg = `📊 <b>СТАТИСТИКА МАГАЗИНУ HOLY DRIP</b>

💰 <b>Фінансові показники:</b>
• <b>Успішний виторг:</b> <b>${sumSuccessful.toLocaleString('uk-UA')} ₴</b>
  ├ 💳 Оплачено: <b>${sumPaid.toLocaleString('uk-UA')} ₴</b> (${paidOrders.length} зам.)
  ├ ✅ Підтверджено: <b>${sumConfirmed.toLocaleString('uk-UA')} ₴</b> (${confirmedOrders.length} зам.)
  └ 🚚 Відправлено: <b>${sumShipped.toLocaleString('uk-UA')} ₴</b> (${shippedOrders.length} зам.)

• ⏳ <b>Очікує оплати:</b> ${sumPending.toLocaleString('uk-UA')} ₴ (${pendingOrders.length} зам.)
• ❌ <b>Скасовано:</b> ${failedOrders.length} зам.

📦 <b>Загальні дані:</b>
• Всього замовлень: <b>${totalOrders}</b>
• Товарів у базі: <b>${productsCount}</b>
• Клієнтів зареєстровано: <b>${usersCount}</b>`;

      await ctx.reply(msg, {
        parse_mode: 'HTML',
        reply_markup: MAIN_KEYBOARD,
      });
    } catch (e: any) {
      this.logger.error('Error calculating stats:', e);
      await ctx.reply(`❌ Помилка при розрахунку статистики: ${e.message}`);
    }
  }

  @Hears('📊 Статистика')
  async onStatsHears(@Ctx() ctx: Context) {
    await this.onStats(ctx);
  }

  // --- /products & 🛍 Каталог товарів ---
  @Command('products')
  async onProducts(@Ctx() ctx: Context) {
    if (!this.isAdmin(ctx)) return;

    try {
      const total = await this.prisma.product.count();
      const products = await this.prisma.product.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { category: true }
      });

      if (!products || products.length === 0) {
        await ctx.reply('🛍 Каталог товарів порожній.', { reply_markup: MAIN_KEYBOARD });
        return;
      }

      let msg = `🛍 <b>Каталог товарів Holy Drip (всього: ${total}):</b>\n\n`;
      products.forEach((p, i) => {
        const sizes = p.sizes?.length ? p.sizes.join(', ') : 'One Size';
        msg += `${i + 1}. <b>${p.name}</b>\n`;
        msg += `   Ціна: <b>${p.price || 0} ₴</b> | Категорія: <i>${p.category?.name || '—'}</i>\n`;
        msg += `   Розміри: <code>${sizes}</code>\n\n`;
      });

      msg += `<i>💡 Керування товарами та фото здійснюється через Sanity Studio або CRM.</i>`;

      await ctx.reply(msg, {
        parse_mode: 'HTML',
        reply_markup: MAIN_KEYBOARD,
      });
    } catch (e: any) {
      this.logger.error('Error fetching products:', e);
      await ctx.reply(`❌ Помилка: ${e.message}`);
    }
  }

  @Hears('🛍 Каталог товарів')
  async onProductsHears(@Ctx() ctx: Context) {
    await this.onProducts(ctx);
  }

  @Hears('🛍 Товари')
  async onProductsHearsShort(@Ctx() ctx: Context) {
    await this.onProducts(ctx);
  }

  // --- /help & ℹ️ Довідка ---
  @Help()
  @Command('help')
  async onHelp(@Ctx() ctx: Context) {
    if (!this.isAdmin(ctx)) return;

    const msg = `ℹ️ <b>ДОВІДКА ДЛЯ АДМІНІСТРАТОРА HOLY DRIP</b>

<b>Можливості бота:</b>
1. <b>Миттєві сповіщення:</b> При кожному замовленні на сайті бот надсилає детальну картку з фото товару, контактами покупця (телефон, Telegram, адреса доставки) та складом кошика.
2. <b>Керування статусами:</b> Під кожним замовленням є кнопки зміни статусу в 1 клік:
   • <b>💳 Оплачено</b> (PAID) — оплата отримана
   • <b>✅ Підтвердити</b> (CONFIRMED) — замовлення взято в роботу
   • <b>🚚 Відправлено</b> (SHIPPED) — відправлено клієнту
   • <b>❌ Скасувати</b> (FAILED) — скасування замовлення
   <i>Статус автоматично синхронізується з сайтом та особистим кабінетом клієнта!</i>

3. <b>Команди швидкого доступу:</b>
   • <b>/orders</b> — Останні замовлення сайту
   • <b>/stats</b> — Фінансовий звіт та статистика
   • <b>/products</b> — Каталог товарів сайту
   • <b>/menu</b> — Головне меню з кнопками дій`;

    await ctx.reply(msg, {
      parse_mode: 'HTML',
      reply_markup: MAIN_KEYBOARD,
    });
  }

  @Hears('ℹ️ Довідка')
  async onHelpHears(@Ctx() ctx: Context) {
    await this.onHelp(ctx);
  }

  // --- Action for order status changes ---
  @Action(/^status:(.+):(.+)$/)
  async onStatusChange(@Ctx() ctx: Context) {
    if (!this.isAdmin(ctx)) {
      await ctx.answerCbQuery('У вас немає доступу.');
      return;
    }

    // @ts-ignore
    const match = ctx.match;
    const orderId = match[1];
    const newStatus = match[2];

    try {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: newStatus as any },
      });

      const statusLabels: Record<string, string> = {
        CONFIRMED: '✅ Підтверджено',
        SHIPPED: '🚚 Відправлено',
        FAILED: '❌ Скасовано',
        PAID: '💳 Оплачено',
        PENDING: '⏳ Очікує оплати',
      };

      const label = statusLabels[newStatus] || newStatus;
      await ctx.answerCbQuery(`Статус змінено на: ${label}`);

      const adminUser = ctx.from?.username ? `@${ctx.from.username}` : (ctx.from?.first_name || 'Адмін');

      const keyboard = {
        inline_keyboard: [
          [
            { text: newStatus === 'PAID' ? '• Оплачено •' : '💳 Оплачено', callback_data: `status:${orderId}:PAID` },
            { text: newStatus === 'CONFIRMED' ? '• Підтверджено •' : '✅ Підтвердити', callback_data: `status:${orderId}:CONFIRMED` }
          ],
          [
            { text: newStatus === 'SHIPPED' ? '• Відправлено •' : '🚚 Відправлено', callback_data: `status:${orderId}:SHIPPED` },
            { text: newStatus === 'FAILED' ? '• Скасовано •' : '❌ Скасувати', callback_data: `status:${orderId}:FAILED` }
          ]
        ]
      };

      try {
        // @ts-ignore
        if (ctx.callbackQuery?.message?.caption) {
          // @ts-ignore
          const currentCaption = ctx.callbackQuery.message.caption.split('\n\n📌 Статус:')[0];
          await ctx.editMessageCaption(
            `${currentCaption}\n\n📌 <b>Статус:</b> ${label} (змінив ${adminUser})`,
            { parse_mode: 'HTML', reply_markup: keyboard }
          );
        } else {
          // @ts-ignore
          const currentText = ctx.callbackQuery.message.text.split('\n\n📌 Статус:')[0];
          await ctx.editMessageText(
            `${currentText}\n\n📌 <b>Статус:</b> ${label} (змінив ${adminUser})`,
            { parse_mode: 'HTML', reply_markup: keyboard }
          );
        }
      } catch (editErr) {
        this.logger.warn('Failed to update telegram message caption/text:', editErr);
      }
    } catch (e: any) {
      this.logger.error('Failed to update status from telegram:', e);
      await ctx.answerCbQuery('Помилка оновлення статусу в БД');
    }
  }
}
