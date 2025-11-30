import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  getById,
  create,
  update,
  remove,
  COLLECTIONS,
  type ContactSubmission,
} from '@/lib/firestore';

// ============ Hooks ============

export function useContacts() {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const ref = collection(db, COLLECTIONS.CONTACTS);
      const snapshot = await getDocs(ref);

      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (ContactSubmission & { id: string })[];

      // Sort by createdAt descending (newest first)
      results.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });

      return results;
    },
  });
}

export function useContact(id: string | undefined) {
  return useQuery({
    queryKey: ['contacts', id],
    queryFn: () =>
      id ? getById<ContactSubmission>(COLLECTIONS.CONTACTS, id) : null,
    enabled: !!id,
  });
}

// ============ Mutations ============

interface CreateContactData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  country?: string;
  subject: string;
  message: string;
  productInterest?: string;
}

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateContactData) => {
      return create<ContactSubmission>(COLLECTIONS.CONTACTS, {
        name: data.name,
        email: data.email,
        company: data.company || '',
        phone: data.phone || '',
        country: data.country || '',
        subject: data.subject,
        message: data.message,
        productInterest: data.productInterest || '',
        isRead: false,
        createdAt: Timestamp.now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useMarkContactRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) =>
      update<ContactSubmission>(COLLECTIONS.CONTACTS, id, { isRead }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useMarkContactReplied() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, replyNote }: { id: string; replyNote?: string }) =>
      update<ContactSubmission>(COLLECTIONS.CONTACTS, id, {
        repliedAt: Timestamp.now(),
        replyNote: replyNote || '',
        isRead: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => remove(COLLECTIONS.CONTACTS, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

// ============ Helpers ============

export function exportContactsToCSV(
  contacts: (ContactSubmission & { id: string })[]
): void {
  const headers = [
    'Name',
    'Email',
    'Company',
    'Phone',
    'Country',
    'Subject',
    'Message',
    'Product Interest',
    'Read',
    'Replied',
    'Reply Note',
    'Date',
  ];

  const rows = contacts.map((c) => [
    c.name || '',
    c.email || '',
    c.company || '',
    c.phone || '',
    c.country || '',
    c.subject || '',
    `"${(c.message || '').replace(/"/g, '""')}"`, // Escape quotes in message
    c.productInterest || '',
    c.isRead ? 'Yes' : 'No',
    c.repliedAt ? 'Yes' : 'No',
    c.replyNote || '',
    c.createdAt?.toDate?.()?.toISOString() || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `contacts_${new Date().toISOString().split('T')[0]}.csv`
  );
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getSubjectLabel(subject: string): string {
  const labels: Record<string, string> = {
    'product-inquiry': 'Product Inquiry',
    'quote-request': 'Quote Request',
    partnership: 'Partnership',
    general: 'General Inquiry',
  };
  return labels[subject] || subject;
}

