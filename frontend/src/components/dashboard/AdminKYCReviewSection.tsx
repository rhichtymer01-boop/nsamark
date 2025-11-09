import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchKYCRequests, updateKYCReview } from '../../services/kyc';

const statusColors: Record<string, string> = {
  pending: 'text-amber-600 bg-amber-100',
  approved: 'text-emerald-600 bg-emerald-100',
  rejected: 'text-rose-600 bg-rose-100'
};

export const AdminKYCReviewSection = () => {
  const queryClient = useQueryClient();
  const { data: requests, isLoading } = useQuery({
    queryKey: ['kyc', 'requests'],
    queryFn: fetchKYCRequests
  });

  const [notes, setNotes] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: ({ kycId, status, note }: { kycId: string; status: 'approved' | 'rejected'; note?: string }) =>
      updateKYCReview(kycId, status, note),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['kyc', 'requests'] });
      setNotes((prev) => ({ ...prev, [variables.kycId]: '' }));
    }
  });

  const sortedRequests = useMemo(() => {
    if (!requests) return [];
    return [...requests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [requests]);

  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <header>
        <h3 className="text-lg font-semibold text-slate-800">KYC Review Queue</h3>
        <p className="text-sm text-slate-500">Approve or reject vendor verification requests.</p>
      </header>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading KYC requests…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Documents</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedRequests.map((request) => {
                const vendorStoreName =
                  typeof request.vendor === 'string' ? undefined : request.vendor?.storeName;

                return (
                  <tr key={request._id} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-700">{vendorStoreName ?? request.name}</p>
                      <p className="text-xs text-slate-500">{request.occupation}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div>{request.name}</div>
                      <div className="text-xs text-slate-500">{request.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <ul className="space-y-1">
                        {request.documents.map((doc) => (
                          <li key={doc.filename}>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary underline-offset-2 hover:underline"
                            >
                              {doc.originalName}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          statusColors[request.status] ?? 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {request.status.toUpperCase()}
                      </span>
                      {request.reviewerNote && (
                        <p className="mt-1 text-[11px] text-slate-400">Note: {request.reviewerNote}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={notes[request._id] ?? ''}
                          onChange={(event) =>
                            setNotes((prev) => ({ ...prev, [request._id]: event.target.value }))
                          }
                          placeholder="Add reviewer note"
                          className="min-h-[60px] rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-primary focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              mutation.mutate({
                                kycId: request._id,
                                status: 'approved',
                                note: notes[request._id]
                              })
                            }
                            className="rounded-md bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-emerald-600"
                            disabled={mutation.isPending}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              mutation.mutate({
                                kycId: request._id,
                                status: 'rejected',
                                note: notes[request._id]
                              })
                            }
                            className="rounded-md bg-rose-500 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-rose-600"
                            disabled={mutation.isPending}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!sortedRequests.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500">
                    No KYC requests at the moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
