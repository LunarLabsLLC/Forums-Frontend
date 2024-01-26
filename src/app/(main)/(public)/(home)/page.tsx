import './styles.css';
import Hero from './Hero';
import HeaderContext from '@/components/HeaderContext';

export default function Home() {
  const headerContent: [string, string] = ["", ``];
  return <>
    <HeaderContext setTo={headerContent}/>
    <Hero />
  </>;
}
