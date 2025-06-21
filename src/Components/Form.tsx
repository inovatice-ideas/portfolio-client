import { FC, useState } from 'react';

export interface Field {
    label: string;
    name: string;
    type: 'text' | 'textarea' | 'url' | 'email' | 'number';
    placeholder?: string;
    optional?: boolean;
  }
  
  interface DynamicFormProps {
    fields: Field[];
    formData: Record<string, any>;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    onSubmit: (e: React.FormEvent) => void;
    onCancel?: () => void;
    submitName: string;
  }
  
  const DynamicForm: FC<DynamicFormProps> = ({ fields, formData, submitName, setFormData, onSubmit, onCancel }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    };
    const [isHoveringCancel, setIsHoveringCancel] = useState(false);
    const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);
  
    return (
      <form onSubmit={onSubmit} className="glass-container-glasscard form-glass">
        {fields.map(({ label, name, type, placeholder, optional }, idx) => (
          <div className="form-group" key={idx}>
            <label htmlFor={name} className='form-label'>{label}</label>
            {type === 'textarea' ? (
              <textarea
                name={name}
                id={name}
                value={formData[name] || ''}
                onChange={handleChange}
                placeholder={placeholder}
                required={!optional}
                className='form-input-textarea'
              />
            ) : (
              <input
                type={type}
                name={name}
                id={name}
                value={formData[name] || ''}
                onChange={handleChange}
                placeholder={placeholder}
                required={!optional}
                className='form-input'
              />
            )}
          </div>
        ))}
        <div className='form-button-container'>
            <button 
                type="submit" 
                className='form-button' 
                onMouseEnter={() => setIsHoveringSubmit(true)} 
                onMouseLeave={() => setIsHoveringSubmit(false)}
                style={{ fontFamily: 'HarryPotterFont', fontSize: '1.5rem', width: '200px'}}
            >
                {isHoveringSubmit ? (submitName === 'Transfigure' ? 'Edit' : 'Add') : submitName}
            </button>
            {onCancel && <button 
                type="button" 
                onClick={onCancel} 
                className='form-button' 
                onMouseEnter={() => setIsHoveringCancel(true)} 
                onMouseLeave={() => setIsHoveringCancel(false)}
                style={{ fontFamily: 'HarryPotterFont', fontSize: '1.5rem', width: '200px' }}
            >
                {isHoveringCancel ? 'Cancel' : 'Evanesco'}
            </button>}
        </div>
      </form>
    );
  };
  
  export default DynamicForm;
  