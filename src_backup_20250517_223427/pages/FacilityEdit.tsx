
import React from 'react';
import Layout from '@/components/layout/Layout';
import FacilityForm from '@/components/facilities/FacilityForm';

const FacilityEdit: React.FC = () => {
  return (
    <Layout>
      <FacilityForm isEdit={true} />
    </Layout>
  );
};

export default FacilityEdit;
