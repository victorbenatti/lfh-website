import { MapPin } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-brand-surface-light bg-brand-black pt-16 pb-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        
        {/* Logos & Text */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-2xl font-black tracking-tighter mb-2">LFH</h2>
          <p className="text-brand-metallic text-sm max-w-sm">
            Liga de Futevôlei de Hortolândia. Elevando o nível do esporte na região com torneios de elite.
          </p>
        </div>

        {/* Local & Partners */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="text-brand-gray text-xs uppercase tracking-widest font-semibold">Parceiro Oficial</div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-surface flex items-center justify-center rounded-sm">
              <MapPin className="text-brand-white w-5 h-5" />
            </div>
            <div>
              <p className="text-brand-white font-bold tracking-wide">Koa House</p>
              <p className="text-brand-metallic text-xs">Hortolândia - SP</p>
            </div>
          </div>
        </div>

        {/* Socials */}
        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="text-brand-gray text-xs uppercase tracking-widest font-semibold">Redes Sociais</div>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/ligafutevoleihortolandia/" className="w-12 h-12 border border-brand-surface-light flex items-center justify-center text-brand-metallic hover:text-brand-white hover:border-brand-gray transition-colors bg-brand-surface">
              <FaInstagram className="w-5 h-5" />
            </a>
          </div>
        </div>
        
      </div>
      
      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-brand-surface-light/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-brand-gray">
        <p>&copy; {new Date().getFullYear()} LFH - Liga de Futevôlei de Hortolândia. Todos os direitos reservados.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-brand-white transition-colors">Termos</a>
          <a href="#" className="hover:text-brand-white transition-colors">Privacidade</a>
        </div>
      </div>
    </footer>
  );
};
