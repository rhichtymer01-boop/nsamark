import { ChangeEvent, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchMyKYC, submitKYCForm } from '../../services/kyc';

interface KYCFormValues {
  name: string;
  phone: string;
  address: string;
  ghanaCardNumber: string;
  occupation: string;
  documents: FileList;
}

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-600',
  approved: 'bg-emerald-100 text-emerald-600',
  rejected: 'bg-rose-100 text-rose-600'
};

export const VendorKYCSection = () => {
  const queryClient = useQueryClient();
  const { data: kycRecord, isLoading } = useQuery({
    queryKey: ['kyc', 'me'],
    queryFn: fetchMyKYC
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { register, handleSubmit, reset } = useForm<KYCFormValues>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      ghanaCardNumber: '',
      occupation: ''
    }
  });

  const mutation = useMutation({
    mutationFn: submitKYCForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc', 'me'] });
      reset();
      setSelectedFiles([]);
    }
  });

  const onSubmit = useCallback(
    (values: KYCFormValues) => {
      const files = selectedFiles.length ? selectedFiles : Array.from(values.documents ?? []);
      mutation.mutate({
        name: values.name,
        phone: values.phone,
        address: values.address,
        ghanaCardNumber: values.ghanaCardNumber,
        occupation: values.occupation,
        documents: files
      });
    },
    [mutation, selectedFiles]
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setSelectedFiles(files);
  };

  return (
    <section className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">KYC Verification</h3>
          <p className="text-sm text-slate-500">Submit your Ghana card and occupation details to get verified.</p>
        </div>
        {kycRecord?.status && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[kycRecord.status] ?? 'bg-slate-100 text-slate-600'}`}
          >
            {kycRecord.status.toUpperCase()}
          </span>
        )}
      </header>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading KYC information...</p>
      ) : (
        <div className="space-y-6">
          {kycRecord && (
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-700">Last submitted:</p>
              <ul className="mt-2 space-y-1">
                <li>Name: {kycRecord.name}</li>
                <li>Phone: {kycRecord.phone}</li>
                <li>Address: {kycRecord.address}</li>
                <li>Occupation: {kycRecord.occupation}</li>
                <li>Documents: {kycRecord.documents.length}</li>
              </ul>
              {kycRecord.reviewerNote && (
                <p className="mt-2 text-xs text-rose-500">Reviewer note: {kycRecord.reviewerNote}</p>
              )}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm text-slate-600">
                Full Name
                <input
                  {...register('name', { required: true })}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  placeholder="John Doe"
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-slate-600">
                Phone Number
                <input
                  {...register('phone', { required: true })}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  placeholder="+233 55 123 4567"
                  required
                />
              </label>
            </div>
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              Business Address
              <input
                {...register('address', { required: true })}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder="123 Market Road, Accra"
                required
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm text-slate-600">
                Ghana Card Number
                <input
                  {...register('ghanaCardNumber', { required: true })}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  placeholder="GHA-123456789-0"
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-slate-600">
                Occupation
                <input
                  {...register('occupation', { required: true })}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  placeholder="Mini Mart Owner"
                  required
                />
              </label>
            </div>
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              Upload Documents (Ghana Card, Business Certificates)
              <input
                type="file"
                {...register('documents')}
                onChange={handleFileChange}
                multiple
                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
              <span className="text-xs text-slate-400">Max 5 files, 5MB each. Accepted: images, PDFs.</span>
            </label>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mutation.isPending ? 'Submitting…' : 'Submit Verification'}
            </button>
          </form>
        </div>
      )}
    </section>
  );
};
