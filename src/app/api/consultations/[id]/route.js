import { NextResponse } from 'next/server';
import { authRequired } from '@/lib/apiHelper';
import Contact from '@/models/Contact';

const mapConsultation = (doc) => {
  if (!doc) return null;
  return {
    id: doc._id,
    _id: doc._id,
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    company: doc.company,
    date: doc.consultationDate,
    time: doc.consultationTime,
    service: doc.serviceArea,
    message: doc.message,
    status: doc.status,
    assigned_lawyer: doc.assigned_lawyer,
    notes: doc.notes,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

// PATCH: Update consultation
export const PATCH = authRequired(
  async (req, { params }) => {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const { status, assigned_lawyer, notes } = await req.json();

    const updateFields = {};
    if (status) updateFields.status = status;
    if (assigned_lawyer !== undefined) updateFields.assigned_lawyer = assigned_lawyer;
    if (notes !== undefined) updateFields.notes = notes;

    const consultation = await Contact.findOneAndUpdate(
      { _id: id, type: 'CONSULTATION' },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!consultation) {
      return NextResponse.json({ detail: 'Consultation not found.' }, { status: 404 });
    }

    return NextResponse.json(mapConsultation(consultation));
  },
  ['ADMIN', 'SUPERADMIN']
);

// DELETE: Delete consultation
export const DELETE = authRequired(
  async (req, { params }) => {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const consultation = await Contact.findOneAndDelete({ _id: id, type: 'CONSULTATION' });

    if (!consultation) {
      return NextResponse.json({ detail: 'Consultation not found.' }, { status: 404 });
    }

    return NextResponse.json({ detail: 'Consultation deleted.' });
  },
  ['ADMIN', 'SUPERADMIN']
);
