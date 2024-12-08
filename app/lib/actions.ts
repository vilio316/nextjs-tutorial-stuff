'use server';
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createInvoice(formData: FormData) {
  const rawFormData = {
    customerId: String(formData.get('customerId')),
    amount: Number(formData.get('amount')) * 100,
    status: String(formData.get('status')),
  };
  const date = new Date().toISOString().split('T')[0];
  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${rawFormData.customerId}, ${rawFormData.amount}, ${rawFormData.status}, ${date})
  `;

  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

export async function updateInvoice(id: string, formData: FormData) {
    const updateValues = {
      customerId: String(formData.get('customerId')),
      amount: Number(formData.get('amount')),
      status: String(formData.get('status')),
    };
    let {amount, customerId, status} = updateValues
    const amountInCents = amount * 100;
   
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
   
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }