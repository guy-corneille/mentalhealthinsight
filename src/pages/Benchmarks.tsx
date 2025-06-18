import React from 'react';
import Layout from '../components/layout/Layout';
import { BenchmarkDashboard } from '../components/benchmarks/BenchmarkDashboard';
import { usePageAuth } from '@/hooks/usePageAuth';

export default function Benchmarks() {
  // Protect at viewer level - all authenticated users can access
  usePageAuth('viewer');

  return (
    <Layout>
            <BenchmarkDashboard />
    </Layout>
  );
}
