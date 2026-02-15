"use client";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import Styles from './order-form.module.css'
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

interface OrderFormProps{
  changeOrderOpenState: () => void;
}
const schema = z.object({
  phone: z.string().regex(/^\+?[0-9]{0,3}[\s.-]?[(]?[0-9]{3}[)]?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4,6}$/, 'Неправильний номер телефону'),
  telegram: z.string().min(1, 'Неправильний нік в тг'),
  name: z.string().min(1, 'Неправильно введено імʼя'),
});

export default function OrderForm({changeOrderOpenState}: OrderFormProps) {
  const { clearCart } = useCart();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const onSubmit = () => {
    console.log("Submit, later send to backend some info xD");
    changeOrderOpenState();
    clearCart();
    router.push('/order-complete');
  }
  return (
    <div className={Styles.orderBackground}>
      <form className={Styles.order} onSubmit={handleSubmit(onSubmit)}>
        <button className={Styles.back} onClick={changeOrderOpenState}>Назад</button>
        <div className={Styles.field}>
          <label htmlFor="phone">Номер телефону</label>
          <input type="text" {...register("phone")} />
          {errors.phone && <p className={Styles.error}>{errors.phone.message}</p>}
        </div>
        <div className={Styles.field}>
          <label htmlFor="telegram">Нік в тг</label>
          <input type="text" {...register("telegram")} />
          {errors.telegram && <p className={Styles.error}>{errors.telegram.message}</p>}
        </div>
        <div className={Styles.field}>
          <label htmlFor="name">Як до вас звертатись?</label>
          <input type="text" {...register("name")} />
          {errors.name && <p className={Styles.error}>{errors.name.message}</p>}
        </div>
        <input className={Styles.submit} type="submit" value="Відправити"/>
      </form>
    </div>
  )
}