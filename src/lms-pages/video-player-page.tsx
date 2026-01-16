// import { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Slider } from "@/components/ui/slider";
// import {
//   Play,
//   Pause,
//   Volume2,
//   VolumeX,
//   Maximize,
//   Minimize,
//   SkipBack,
//   SkipForward,
//   CheckCircle,
//   ArrowLeft,
// } from "lucide-react";
// import { useParams, usePathname, useRouter } from "next/navigation";

// interface Chapter {
//   id: string;
//   title: string;
//   duration: string;
//   timestamp: number;
//   completed?: boolean;
// }

// export default function VideoPlayer() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [data, setData] = useState({
//     title: " ",
//     chapters: [],
//     videoUrl: "",
//   });
//   //   const pathname = usePathname();
//   //   const { title, chapters, videoUrl } = location.state || {
//   //     title: "Course Video",
//   //     chapters: [],
//   //     videoUrl:
//   //       "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//   //   };

//   useEffect(() => {
//     const data = JSON.parse(localStorage.getItem("videoPageData") || "{}");
//     setData(data);
//     console.log(data.title, data.chapters, data.videoUrl);
//   }, []);

//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [volume, setVolume] = useState(1);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [playbackRate, setPlaybackRate] = useState(1);
//   const [showControls, setShowControls] = useState(true);
//   const [currentChapter, setCurrentChapter] = useState(0);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     const handleTimeUpdate = () => setCurrentTime(video.currentTime);
//     const handleLoadedMetadata = () => setDuration(video.duration);
//     const handleEnded = () => setIsPlaying(false);

//     video.addEventListener("timeupdate", handleTimeUpdate);
//     video.addEventListener("loadedmetadata", handleLoadedMetadata);
//     video.addEventListener("ended", handleEnded);

//     return () => {
//       video.removeEventListener("timeupdate", handleTimeUpdate);
//       video.removeEventListener("loadedmetadata", handleLoadedMetadata);
//       video.removeEventListener("ended", handleEnded);
//     };
//   }, []);

//   //   useEffect(() => {
//   //     const chapter = data.chapters.findIndex((ch: Chapter, idx: number) => {
//   //       const nextChapter = chapters[idx + 1];
//   //       return (
//   //         currentTime >= ch.timestamp &&
//   //         (!nextChapter || currentTime < nextChapter.timestamp)
//   //       );
//   //     });
//   //     if (chapter !== -1) setCurrentChapter(chapter);
//   //   }, [currentTime, chapters]);

//   const togglePlay = () => {
//     if (videoRef.current) {
//       if (isPlaying) {
//         videoRef.current.pause();
//       } else {
//         videoRef.current.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const handleSeek = (value: number[]) => {
//     if (videoRef.current) {
//       videoRef.current.currentTime = value[0];
//       setCurrentTime(value[0]);
//     }
//   };

//   const handleVolumeChange = (value: number[]) => {
//     if (videoRef.current) {
//       const newVolume = value[0];
//       videoRef.current.volume = newVolume;
//       setVolume(newVolume);
//       setIsMuted(newVolume === 0);
//     }
//   };

//   const toggleMute = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = !isMuted;
//       setIsMuted(!isMuted);
//     }
//   };

//   const toggleFullscreen = () => {
//     if (!containerRef.current) return;

//     if (!isFullscreen) {
//       containerRef.current.requestFullscreen();
//     } else {
//       document.exitFullscreen();
//     }
//     setIsFullscreen(!isFullscreen);
//   };

//   const skipTime = (seconds: number) => {
//     if (videoRef.current) {
//       videoRef.current.currentTime += seconds;
//     }
//   };

//   const jumpToChapter = (timestamp: number) => {
//     if (videoRef.current) {
//       videoRef.current.currentTime = timestamp;
//       setCurrentTime(timestamp);
//     }
//   };

//   const changePlaybackRate = () => {
//     const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
//     const currentIndex = rates.indexOf(playbackRate);
//     const nextRate = rates[(currentIndex + 1) % rates.length];
//     setPlaybackRate(nextRate);
//     if (videoRef.current) {
//       videoRef.current.playbackRate = nextRate;
//     }
//   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   const handleMouseMove = () => {
//     setShowControls(true);
//     if (controlsTimeoutRef.current) {
//       clearTimeout(controlsTimeoutRef.current);
//     }
//     controlsTimeoutRef.current = setTimeout(() => {
//       if (isPlaying) setShowControls(false);
//     }, 3000);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="border-b border-border bg-card sticky top-0 z-10">
//         <div className="container mx-auto px-4 py-4 flex items-center gap-4">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => router.push(`/courses/${id}`)}
//           >
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//           <h1 className="text-xl font-semibold truncate">{title}</h1>
//         </div>
//       </div>

//       <div className="container mx-auto p-0 lg:p-4">
//         <div className="grid lg:grid-cols-[1fr,350px] gap-0 lg:gap-4">
//           {/* Video Player */}
//           <div
//             ref={containerRef}
//             className="relative bg-black aspect-video lg:rounded-lg overflow-hidden"
//             onMouseMove={handleMouseMove}
//             onMouseLeave={() => isPlaying && setShowControls(false)}
//           >
//             <video
//               ref={videoRef}
//               src={videoUrl}
//               className="w-full h-full"
//               onClick={togglePlay}
//             />

//             {/* Play Overlay */}
//             <AnimatePresence>
//               {!isPlaying && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="absolute inset-0 flex items-center justify-center bg-black/30"
//                 >
//                   <Button
//                     size="lg"
//                     onClick={togglePlay}
//                     className="h-20 w-20 rounded-full"
//                   >
//                     <Play className="h-8 w-8 fill-current" />
//                   </Button>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Controls */}
//             <AnimatePresence>
//               {showControls && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 20 }}
//                   className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 space-y-2"
//                 >
//                   {/* Progress Bar */}
//                   <Slider
//                     value={[currentTime]}
//                     max={duration}
//                     step={0.1}
//                     onValueChange={handleSeek}
//                     className="cursor-pointer"
//                   />

//                   <div className="flex items-center justify-between gap-4">
//                     <div className="flex items-center gap-2">
//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         onClick={togglePlay}
//                         className="text-white hover:bg-white/20"
//                       >
//                         {isPlaying ? (
//                           <Pause className="h-5 w-5" />
//                         ) : (
//                           <Play className="h-5 w-5" />
//                         )}
//                       </Button>

//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         onClick={() => skipTime(-10)}
//                         className="text-white hover:bg-white/20"
//                       >
//                         <SkipBack className="h-4 w-4" />
//                       </Button>

//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         onClick={() => skipTime(10)}
//                         className="text-white hover:bg-white/20"
//                       >
//                         <SkipForward className="h-4 w-4" />
//                       </Button>

//                       <div className="flex items-center gap-2 group">
//                         <Button
//                           size="icon"
//                           variant="ghost"
//                           onClick={toggleMute}
//                           className="text-white hover:bg-white/20"
//                         >
//                           {isMuted || volume === 0 ? (
//                             <VolumeX className="h-4 w-4" />
//                           ) : (
//                             <Volume2 className="h-4 w-4" />
//                           )}
//                         </Button>
//                         <div className="w-0 group-hover:w-24 transition-all duration-200 overflow-hidden">
//                           <Slider
//                             value={[isMuted ? 0 : volume]}
//                             max={1}
//                             step={0.01}
//                             onValueChange={handleVolumeChange}
//                             className="cursor-pointer"
//                           />
//                         </div>
//                       </div>

//                       <span className="text-white text-sm hidden sm:inline">
//                         {formatTime(currentTime)} / {formatTime(duration)}
//                       </span>
//                     </div>

//                     <div className="flex items-center gap-2">
//                       <Button
//                         size="sm"
//                         variant="ghost"
//                         onClick={changePlaybackRate}
//                         className="text-white hover:bg-white/20 h-8 px-3"
//                       >
//                         {playbackRate}x
//                       </Button>

//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         onClick={toggleFullscreen}
//                         className="text-white hover:bg-white/20"
//                       >
//                         {isFullscreen ? (
//                           <Minimize className="h-4 w-4" />
//                         ) : (
//                           <Maximize className="h-4 w-4" />
//                         )}
//                       </Button>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Chapter Navigation */}
//           <div className="border-t lg:border-t-0 lg:border-l border-border bg-card lg:rounded-lg overflow-hidden">
//             <div className="p-4 border-b border-border">
//               <h3 className="font-semibold">Course Content</h3>
//               <p className="text-sm text-muted-foreground">
//                 {chapters.length} chapters
//               </p>
//             </div>

//             <ScrollArea className="h-[400px] lg:h-[calc(100vh-200px)]">
//               <div className="p-2">
//                 {chapters.map((chapter: Chapter, index: number) => (
//                   <motion.button
//                     key={chapter.id}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.05 }}
//                     onClick={() => jumpToChapter(chapter.timestamp)}
//                     className={`w-full text-left p-4 rounded-lg mb-2 transition-all ${
//                       currentChapter === index
//                         ? "bg-primary text-primary-foreground"
//                         : "hover:bg-muted"
//                     }`}
//                   >
//                     <div className="flex items-start gap-3">
//                       <div className="flex-shrink-0 mt-1">
//                         {chapter.completed ? (
//                           <CheckCircle className="h-5 w-5 text-green-500" />
//                         ) : (
//                           <div
//                             className={`h-5 w-5 rounded-full border-2 flex items-center justify-center text-xs ${
//                               currentChapter === index
//                                 ? "border-primary-foreground text-primary-foreground"
//                                 : "border-muted-foreground text-muted-foreground"
//                             }`}
//                           >
//                             {index + 1}
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="font-medium text-sm mb-1 line-clamp-2">
//                           {chapter.title}
//                         </p>
//                         <p
//                           className={`text-xs ${
//                             currentChapter === index
//                               ? "text-primary-foreground/80"
//                               : "text-muted-foreground"
//                           }`}
//                         >
//                           {chapter.duration}
//                         </p>
//                       </div>
//                     </div>
//                   </motion.button>
//                 ))}
//               </div>
//             </ScrollArea>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
