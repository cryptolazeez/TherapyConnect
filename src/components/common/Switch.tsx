import React from 'react';
import { cn } from '../../utils/cn';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  className,
  ...props
}) => {
  return (
    <label className={cn('inline-flex items-center cursor-pointer', className)}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          {...props}
        />
        <div
          className={cn(
            'block w-10 h-6 rounded-full transition-colors',
            checked ? 'bg-primary-600' : 'bg-gray-300'
          )}
        />
        <div
          className={cn(
            'absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform',
            checked ? 'transform translate-x-4' : ''
          )}
        />
      </div>
      {label && <span className="ml-2 text-sm text-gray-700">{label}</span>}
    </label>
  );
};

export default Switch;
