import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Search, Menu, X, ArrowRight, ExternalLink, Mail, MapPin, Phone, Quote, ArrowUp } from 'lucide-react';
import { getKijijiListings } from './services/kijijiService';
import { Logo } from './components/Logo';
import { CuratorsLens } from './components/CuratorsLens';
import { LegalModal } from './components/LegalModal';
import { TERMS_OF_USE, PRIVACY_POLICY } from './constants/legal';

interface Listing {
  title: string;
  price: string;
  description: string;
  url: string;
  imageUrl: string;
  imagePrompt: string;
  category: 'Books' | 'Collectibles';
}

export default function App() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Listing | null>(null);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Books' | 'Collectibles'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; title: string; content: string }>({
    isOpen: false,
    title: '',
    content: ''
  });

  const syncListings = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await getKijijiListings();
      const categorizedData = data.map((item: any) => {
        const title = item.title.toLowerCase();
        const isCollectible = title.includes('tamagotchi') || title.includes('hot wheels') || title.includes('hotwheels');
        return {
          ...item,
          category: isCollectible ? 'Collectibles' : 'Books'
        };
      });
      setListings(categorizedData);
      setLastSynced(new Date());
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    syncListings();
    
    // Automatic sync every 5 minutes
    const interval = setInterval(() => {
      syncListings(false);
    }, 5 * 60 * 1000);

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 1000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const FeaturedCarousel = () => (
    <div className="relative w-full overflow-hidden py-12 bg-[#f5f2ed]">
      <div className="max-w-7xl mx-auto px-6 mb-8 flex justify-between items-end">
        <div>
          <span className="text-xs uppercase tracking-widest opacity-50 mb-2 block font-sans">Curated Selection</span>
          <h2 className="text-3xl font-light">Featured This Week</h2>
        </div>
        <div className="flex gap-2">
          <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180" />
          </div>
          <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-colors">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
      
      <motion.div 
        className="flex gap-4 px-6 overflow-x-auto no-scrollbar pb-8"
        drag="x"
        dragConstraints={{ left: -1000, right: 0 }}
      >
        {listings.map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedProduct(item)}
            className="min-w-[240px] md:min-w-[280px] bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer group"
          >
            <div className="aspect-square overflow-hidden">
              <img 
                src={item.imageUrl || `https://picsum.photos/seed/${i + 100}/600/600`} 
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-4">
              <h3 className="text-base mb-1 font-medium line-clamp-1">{item.title}</h3>
              <p className="text-xs opacity-60 line-clamp-1 mb-3">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold">{item.price} CAD</span>
                <span className="text-[10px] uppercase tracking-widest border-b border-black/20 group-hover:border-black transition-colors">Details</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  const ProductPage = ({ product, onBack }: { product: Listing, onBack: () => void }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-[100] bg-[#fdfcf8] overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 px-6 py-3 bg-black text-white rounded-full text-sm uppercase tracking-widest mb-12 hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to Collection
        </button>

        <div className="grid lg:grid-cols-2 gap-12 md:gap-16">
          <div className="space-y-6">
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl">
              <img 
                src={product.imageUrl || `https://picsum.photos/seed/${product.title}/1200/1500`} 
                alt={product.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-black/5">
                  <img 
                    src={`https://picsum.photos/seed/${product.title + i}/400/400`} 
                    alt="Detail"
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-sm uppercase tracking-[0.3em] opacity-50 mb-4 block">Rare Collectible</span>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-light mb-6 leading-tight">{product.title}</h1>
            <div className="text-2xl md:text-3xl font-bold mb-8 text-[#1a1a1a]">{product.price} CAD</div>
            
            <div className="prose prose-lg text-[#1a1a1a]/70 mb-12 leading-relaxed">
              <p>{product.description}</p>
              <p className="mt-4">
                This item is currently listed on our official Kijiji storefront. 
                All transactions are handled securely through the platform to ensure 
                buyer protection and verified authenticity.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <a 
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-12 py-5 bg-[#1a1a1a] text-white rounded-full text-sm uppercase tracking-widest hover:bg-[#333] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Purchase on Kijiji <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-center text-xs opacity-40 uppercase tracking-widest">
                Redirects to Kijiji.ca for secure checkout
              </p>
            </div>

            <div className="mt-16 pt-16 border-t border-black/5 grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-xs uppercase tracking-widest opacity-50 mb-2">Condition</h4>
                <p className="font-medium">Excellent / Near Mint</p>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest opacity-50 mb-2">Availability</h4>
                <p className="font-medium">In Stock (1 available)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#fdfcf8] text-[#1a1a1a] font-serif selection:bg-[#e5e2d9]">
      <AnimatePresence>
        {selectedProduct && (
          <ProductPage 
            product={selectedProduct} 
            onBack={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#fdfcf8]/90 backdrop-blur-xl border-b border-[#1a1a1a]/10">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <Logo className="w-10 h-10 text-[#1a1a1a] transition-transform group-hover:rotate-12" />
            <span className="text-2xl font-bold tracking-[-0.05em] uppercase leading-none">Whiteharmar Books</span>
          </div>
          
          <div className="hidden md:flex items-center gap-12 text-sm uppercase tracking-widest font-sans font-medium">
            <a href="#collection" className="hover:opacity-50 transition-opacity">Collection</a>
            <a href="#about" className="hover:opacity-50 transition-opacity">Our Story</a>
            <a href="#contact" className="hover:opacity-50 transition-opacity">Contact</a>
            
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    type="text"
                    placeholder="Search collection..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-black/5 rounded-full px-6 py-2 outline-none text-sm font-sans lowercase tracking-normal"
                    autoFocus
                  />
                )}
              </AnimatePresence>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 rounded-full transition-colors ${isSearchOpen ? 'bg-black text-white ml-2' : 'hover:bg-black/5'}`}
              >
                {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            className="md:hidden w-12 h-12 flex items-center justify-center rounded-full bg-black/5"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
            />
            
            {/* Sidebar */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm z-[70] bg-[#fdfcf8] shadow-2xl md:hidden flex flex-col"
            >
              <div className="p-8 flex justify-between items-center border-b border-black/5">
                <div className="relative flex-1 mr-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                  <input 
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/5 rounded-full py-3 pl-12 pr-6 outline-none text-sm font-sans"
                  />
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-12 h-12 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform shrink-0"
                  aria-label="Close Menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 px-12 py-12 flex flex-col gap-10">
                {[
                  { name: 'Collection', href: '#collection' },
                  { name: 'Our Story', href: '#about' },
                  { name: 'The Curator\'s Lens', href: '#curators-lens' },
                  { name: 'Contact', href: '#contact' }
                ].map((item, i) => (
                  <motion.a
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-4xl font-light tracking-tight hover:italic transition-all"
                  >
                    {item.name}
                  </motion.a>
                ))}
              </div>
              
              <div className="p-12 border-t border-black/5">
                <div className="flex flex-col gap-4">
                  <span className="text-xs uppercase tracking-[0.3em] opacity-40">Inquiries</span>
                  <a href="tel:7053021660" className="text-lg font-medium">705.302.1660</a>
                  <a href="mailto:harmarwhite@gmail.com" className="text-lg font-medium">harmarwhite@gmail.com</a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-48 pb-24 px-6 overflow-hidden bg-[#1a1a1a] text-[#fdfcf8]">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-sm uppercase tracking-[0.5em] opacity-50 mb-8 block">Whiteharmar Books</span>
            <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[12rem] font-light leading-[0.8] tracking-tighter mb-12">
              Rare <br />
              <span className="italic font-serif">Treasures.</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#fdfcf8]/70 max-w-2xl mx-auto mb-16 leading-relaxed font-serif italic">
              "Every book carries more than just a story—it carries the soul of its era."
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <a 
                href="#collection"
                className="inline-flex items-center justify-center gap-3 px-12 py-5 bg-[#fdfcf8] text-[#1a1a1a] rounded-full text-sm uppercase tracking-widest hover:scale-105 transition-transform"
              >
                Explore Collection <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="#curators-lens"
                className="inline-flex items-center justify-center gap-3 px-12 py-5 border border-white/20 text-white rounded-full text-sm uppercase tracking-widest hover:bg-white/10 transition-colors"
              >
                The Curator's Lens <Search className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Carousel */}
      {!loading && <FeaturedCarousel />}

      {/* The Curator's Lens Feature */}
      <CuratorsLens listings={listings} />

      {/* Featured Collection */}
      <section id="collection" className="py-48 px-6 bg-[#1a1a1a] text-[#fdfcf8]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-sm uppercase tracking-[0.4em] opacity-50 mb-6 block">The Library</span>
              <h2 className="text-6xl md:text-8xl font-light tracking-tight leading-none">Available <br /><span className="italic">Collection</span></h2>
              {lastSynced && (
                <span className="text-[10px] uppercase tracking-[0.2em] opacity-30 mt-4 block">
                  Last Synced: {lastSynced.toLocaleTimeString()}
                </span>
              )}
            </div>
            <div className="flex flex-col items-end gap-6">
              <p className="max-w-xs text-xl opacity-70 italic font-serif leading-relaxed text-right">
                Hand-selected for historical significance, provenance, and exceptional condition.
              </p>
              <div className="flex gap-4 p-1 bg-white/5 rounded-full border border-white/10">
                {['All', 'Books', 'Collectibles'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat as any)}
                    className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${
                      activeCategory === cat 
                        ? 'bg-white text-black font-bold' 
                        : 'hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-white/5 rounded-xl mb-4" />
                  <div className="h-4 bg-white/5 w-3/4 mb-2" />
                  <div className="h-3 bg-white/5 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {listings && listings.length > 0 ? (
                <>
                  {listings
                    .filter(item => activeCategory === 'All' || item.category === activeCategory)
                    .filter(item => 
                      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      item.description.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {listings
                        .filter(item => activeCategory === 'All' || item.category === activeCategory)
                        .filter(item => 
                          item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: (index % 5) * 0.05 }}
                          viewport={{ once: true }}
                          className="group cursor-pointer"
                          onClick={() => setSelectedProduct(item)}
                        >
                          <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                            <img 
                              src={item.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(item.title)}/600/600`} 
                              alt={item.title}
                              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-3 right-3 bg-white text-black px-3 py-1 rounded-full text-[10px] font-bold shadow-md">
                              {item.price} CAD
                            </div>
                            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[8px] uppercase tracking-widest border border-white/10">
                              {item.category}
                            </div>
                          </div>
                          <h3 className="text-lg mb-1 group-hover:italic transition-all line-clamp-1">{item.title}</h3>
                          <p className="text-white/40 text-xs mb-4 line-clamp-1 leading-relaxed">{item.description}</p>
                          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest border-b border-white/10 pb-0.5 group-hover:border-white transition-colors">
                            View Details <ArrowRight className="w-2 h-2" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-32 px-6 border border-white/10 rounded-[40px] bg-white/5">
                      <p className="text-2xl italic mb-4 opacity-70">No items match your search for "{searchQuery}".</p>
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="text-sm uppercase tracking-widest border-b border-white/20 hover:border-white transition-colors"
                      >
                        Clear Search
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-32 px-6 border border-white/10 rounded-[40px] bg-white/5">
                  <p className="text-2xl italic mb-8 opacity-70">We are currently synchronizing our latest acquisitions from Kijiji.</p>
                  <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <button 
                      onClick={() => syncListings()}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 text-white rounded-full text-sm uppercase tracking-widest hover:bg-white/20 transition-all"
                    >
                      Retry Sync
                    </button>
                    <a 
                      href="https://www.kijiji.ca/o-profile/1046257614/listings/1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-[#fdfcf8] text-[#1a1a1a] rounded-full text-sm uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                      Browse Kijiji Directly <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-sm uppercase tracking-[0.3em] text-[#1a1a1a]/50 mb-6 block">Our Heritage</span>
            <h2 className="text-5xl md:text-7xl font-light mb-12 leading-tight">Preserving the <span className="italic">Written Word</span></h2>
            <div className="max-w-3xl mx-auto space-y-8 text-xl text-[#1a1a1a]/70 leading-relaxed font-serif">
              <p>
                Whiteharmar Books began with a simple passion for the tactile history of literature. 
                Based in Sault Ste. Marie, Ontario, we specialize in sourcing rare editions that are often lost to time.
              </p>
              <p>
                Our Kijiji storefront serves as our primary gallery, connecting collectors across Canada with 
                one-of-a-kind finds from the heart of the Great Lakes.
              </p>
            </div>
          </div>
          
          <div className="p-12 bg-[#f5f2ed] rounded-[40px] border border-black/5 max-w-3xl mx-auto">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-center">A Note from the Curator</h4>
            <p className="italic text-2xl opacity-80 leading-relaxed text-center font-serif">
              "In an increasingly digital age, the physical book remains a sanctuary. 
              My mission is to find these sanctuaries and place them in the hands of those 
              who will cherish them for another century."
            </p>
            <div className="mt-10 pt-10 border-t border-black/10 flex items-center justify-center gap-6">
              <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl">WB</div>
              <div>
                <p className="text-lg font-bold uppercase tracking-widest leading-none">Whiteharmar Books</p>
                <p className="text-xs uppercase opacity-50 tracking-widest mt-1">Sault Ste. Marie, Ontario</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 bg-[#1a1a1a] text-[#fdfcf8]">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24">
            <div>
              <span className="text-sm uppercase tracking-[0.3em] opacity-50 mb-6 block">Inquiries</span>
              <h2 className="text-5xl font-light mb-8 leading-tight">Connect with the <br /><span className="italic">Curator</span></h2>
              <p className="text-lg opacity-70 mb-12 leading-relaxed">
                Whether you are seeking a specific first edition or wish to discuss the provenance of a piece, 
                we welcome your correspondence.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest opacity-40 block mb-1">Email</span>
                    <a href="mailto:harmarwhite@gmail.com" className="text-xl hover:opacity-50 transition-opacity">harmarwhite@gmail.com</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest opacity-40 block mb-1">Telephone</span>
                    <a href="tel:7053021660" className="text-xl hover:opacity-50 transition-opacity">705.302.1660</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest opacity-40 block mb-1">Location</span>
                    <p className="text-xl">Sault Ste. Marie, ON</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 p-12 rounded-[40px] border border-white/10 flex flex-col justify-center text-center">
              <Quote className="w-12 h-12 mx-auto mb-8 opacity-20" />
              <p className="text-2xl italic font-light leading-relaxed mb-12">
                "A room without books is like a body without a soul."
              </p>
              <a 
                href="https://www.kijiji.ca/o-profile/1046257614"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-12 py-5 bg-[#fdfcf8] text-[#1a1a1a] rounded-full text-sm uppercase tracking-widest hover:scale-105 transition-transform"
              >
                Visit Our Kijiji Profile <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#1a1a1a]/5 text-center">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-sm uppercase tracking-[0.2em] opacity-40 mb-4">
          <button 
            onClick={() => setLegalModal({ isOpen: true, title: 'Terms of Use', content: TERMS_OF_USE })}
            className="hover:opacity-100 transition-opacity"
          >
            Terms of Use
          </button>
          <span className="hidden md:block">•</span>
          <button 
            onClick={() => setLegalModal({ isOpen: true, title: 'Privacy Policy', content: PRIVACY_POLICY })}
            className="hover:opacity-100 transition-opacity"
          >
            Privacy Policy
          </button>
        </div>
        <p className="text-xs uppercase tracking-[0.2em] opacity-20">
          &copy; {new Date().getFullYear()} Whiteharmar Books.
        </p>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Legal Modal */}
      <LegalModal 
        isOpen={legalModal.isOpen}
        onClose={() => setLegalModal(prev => ({ ...prev, isOpen: false }))}
        title={legalModal.title}
        content={legalModal.content}
      />
    </div>
  );
}
