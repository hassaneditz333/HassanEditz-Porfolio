
// VideoReel section commented out as requested. Uncomment to restore.
// import { motion } from 'motion/react';
// import { Play } from 'lucide-react';
//
// export default function VideoReel() {
//   return (
//     <section className="py-32 px-6 bg-secondary-bg relative" id="reel">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-16">
//           <motion.span 
//             className="text-accent text-sm font-semibold tracking-wider uppercase mb-4 block"
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//           >
//             Showreel 2026
//           </motion.span>
//           <motion.h2 
//             className="text-4xl md:text-5xl lg:text-6xl font-display font-bold"
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.1 }}
//           >
//             Watch My <span className="text-gradient">Editing Showreel</span>
//           </motion.h2>
//         </div>
//
//         <motion.div 
//           className="relative w-full aspect-video rounded-3xl overflow-hidden group cursor-pointer border border-white/10 shadow-2xl"
//           initial={{ opacity: 0, scale: 0.95 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8 }}
//         >
//           {/* Background Glow */}
//           <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
//           
//           <img 
//             src="https://images.unsplash.com/photo-1578022761797-b8636ac1773c?q=80&w=2000&auto=format&fit=crop" 
//             alt="Showreel Thumbnail" 
//             className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80"
//             referrerPolicy="no-referrer"
//           />
//           
//           <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
//           
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="relative">
//               {/* Pulsing rings */}
//               <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" style={{ animationDuration: '3s' }} />
//               <div className="absolute inset-0 rounded-full bg-accent/30 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
//               
//               {/* Play Button */}
//               <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center neon-glow group-hover:bg-primary/90 transition-all duration-500 group-hover:scale-110">
//                 <Play size={48} fill="currentColor" className="text-white ml-3" />
//               </div>
//             </div>
//           </div>
//           
//           <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
//             <div>
//               <h3 className="text-3xl font-display font-bold text-white mb-2">Cinematic Showreel</h3>
//               <p className="text-gray-300">A compilation of my best work from 2025-2026.</p>
//             </div>
//             <span className="text-white/70 font-mono">02:45</span>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// Placeholder export to avoid errors when importing
export default function VideoReel() { return null; }
