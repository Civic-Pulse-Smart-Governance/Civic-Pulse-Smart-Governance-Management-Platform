import { Search, RotateCcw } from 'lucide-react';
import { Field, Input, Select } from './FormControls';
import Button from './Button';

export default function FilterBar({ filters, onChange, onReset }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
      <div className="lg:col-span-2">
        <Field label="Search">
          <Input
            icon={Search}
            placeholder="Search by complaint ID or keyword..."
            value={filters.search}
            onChange={(e) => onChange('search', e.target.value)}
          />
        </Field>
      </div>
      <Field label="Status">
        <Select value={filters.status} onChange={(e) => onChange('status', e.target.value)}>
          <option>All Status</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Resolved</option>
          <option>Rejected</option>
        </Select>
      </Field>
      <Field label="Priority">
        <Select value={filters.priority} onChange={(e) => onChange('priority', e.target.value)}>
          <option>All Priority</option>
          <option>LOW</option>
          <option>MEDIUM</option>
          <option>HIGH</option>
        </Select>
      </Field>
      <div className="flex gap-2">
        <div className="flex-1">
          <Field label="Category">
            <Select value={filters.category} onChange={(e) => onChange('category', e.target.value)}>
              <option>All Categories</option>
              <option>Street Light</option>
              <option>Water Supply</option>
              <option>Sanitation</option>
              <option>Roads</option>
              <option>Building</option>
            </Select>
          </Field>
        </div>
        <Button variant="secondary" icon={RotateCcw} onClick={onReset} className="h-[42px] mt-6">
          Reset
        </Button>
      </div>
    </div>
  );
}
