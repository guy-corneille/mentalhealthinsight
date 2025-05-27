
import React from 'react';
import Layout from '@/components/layout/Layout';
import FacilityForm from '@/components/facilities/FacilityForm';

const FacilityAdd: React.FC = () => {
  return (
    <Layout>
      <FacilityForm isEdit={false} />
    </Layout>
  );
};

export default FacilityAdd;
