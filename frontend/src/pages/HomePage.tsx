import Hero from '@/components/home/Hero';
import CategoryFilter from '@/components/home/CategoryFilter';
import FeaturedMeals from '@/components/home/FeaturedMeals';
import TopCooks from '@/components/home/TopCooks';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [category, setCategory] = useState('all');
  const navigate = useNavigate();

  return (
    <div>
      <Hero />
      <CategoryFilter active={category} onSelect={(id) => {
        setCategory(id);
        navigate(`/meals${id !== 'all' ? `?category=${id}` : ''}`);
      }} />
      <FeaturedMeals />
      <TopCooks />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </div>
  );
}
