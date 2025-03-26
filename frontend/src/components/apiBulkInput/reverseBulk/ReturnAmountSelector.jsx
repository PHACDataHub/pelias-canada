import { useTranslation } from 'react-i18next';
import { GcdsSelect } from '@cdssnc/gcds-components-react';
import React, { useState } from 'react';

export default function ReturnAmountSelector({ onChange }) {
  const { t, i18n } = useTranslation();
  const [itemsPerCall, setItemsPerCall] = useState(5);

  const handleChange = (e) => {
    const newItemsPerPage = Number(e.target.value);
    setItemsPerCall(newItemsPerPage);
    if (onChange) {
      onChange(newItemsPerPage); // Pass updated value to the parent
    }
  };

  return (
    <GcdsSelect
      selectId={t('components.reverseBulk.ReturnAmountSelector.selectID')}
      label={t('components.reverseBulk.ReturnAmountSelector.label')}
      name={t('components.reverseBulk.ReturnAmountSelector.label')}
      hint={t('components.reverseBulk.ReturnAmountSelector.hint')}
      onGcdsChange={handleChange}
      lang={i18n.language}
      value={itemsPerCall}
    >
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
    </GcdsSelect>
  );
}
