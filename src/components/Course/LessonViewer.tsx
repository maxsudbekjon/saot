import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, RotateCw, Settings, Download, BookOpen, CheckCircle, Clock, FileText, Lock } from 'lucide-react';
import { Lesson, Course } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface LessonViewerProps {
  lesson: Lesson;
  course: Course;
  onBack: () => void;
  onNextLesson?: () => void;
  onPrevLesson?: () => void;
  allLessons: Lesson[];
}

const LessonViewer: React.FC<LessonViewerProps> = ({ 
  lesson, 
  course, 
  onBack, 
  onNextLesson, 
  onPrevLesson,
  allLessons 
}) => {
  const { user, hasAccessToCourse } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  const hasAccess = hasAccessToCourse(course.id);
  const currentLessonIndex = allLessons.findIndex(l => l.id === lesson.id);
  const nextLesson = allLessons[currentLessonIndex + 1];
  const prevLesson = allLessons[currentLessonIndex - 1];

  // Birinchi 2 ta dars hamma uchun ochiq (hatto ro'yxatdan o'tmaganlar ham)
  const isLessonAccessible = currentLessonIndex < 2 || hasAccess;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setLessonCompleted(true);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value) / 100;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  const skipTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isLessonAccessible) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button 
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-purple-600 mb-6 transition-colors duration-200 font-semibold bg-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl border border-gray-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Kursga qaytish
          </button>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
              <Lock className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Bu dars bloklangan</h2>
            <p className="text-gray-600 mb-6">
              Bu darsni ko'rish uchun kursni Telegram bot orqali sotib olishingiz kerak.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-200">
              Kursni Sotib Olish
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button 
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-purple-600 mb-6 transition-colors duration-200 font-semibold bg-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl border border-gray-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Kursga qaytish
        </button>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900 rounded-xl overflow-hidden relative group border border-gray-300 shadow-xl">
              <video
                ref={videoRef}
                className="w-full aspect-video"
                poster={course.thumbnail}
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
              >
                <source src={lesson.videoUrl} type="video/mp4" />
                Brauzeringiz video formatini qo'llab-quvvatlamaydi.
              </video>

              {/* Video Controls */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {/* Play/Pause Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={togglePlay}
                    className="bg-blue-600/80 backdrop-blur-sm p-4 rounded-full hover:bg-blue-600 transition-all duration-200 border border-blue-400/30"
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8 text-white" />
                    ) : (
                      <Play className="h-8 w-8 text-white ml-1" />
                    )}
                  </button>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={duration ? (currentTime / duration) * 100 : 0}
                      onChange={handleSeek}
                      className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-colors duration-200">
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </button>
                      
                      <button onClick={() => skipTime(-10)} className="text-white hover:text-blue-400 transition-colors duration-200">
                        <RotateCcw className="h-5 w-5" />
                      </button>
                      
                      <button onClick={() => skipTime(10)} className="text-white hover:text-blue-400 transition-colors duration-200">
                        <RotateCw className="h-5 w-5" />
                      </button>

                      <div className="flex items-center space-x-2">
                        <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors duration-200">
                          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={isMuted ? 0 : volume * 100}
                          onChange={handleVolumeChange}
                          className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <button
                          onClick={() => setShowSettings(!showSettings)}
                          className="text-white hover:text-blue-400 transition-colors duration-200"
                        >
                          <Settings className="h-5 w-5" />
                        </button>
                        
                        {showSettings && (
                          <div className="absolute bottom-8 right-0 bg-gray-900/90 backdrop-blur-sm rounded-lg p-2 min-w-32 border border-gray-600">
                            <div className="text-white text-sm mb-2">Tezlik</div>
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                              <button
                                key={rate}
                                onClick={() => changePlaybackRate(rate)}
                                className={`block w-full text-left px-2 py-1 text-sm rounded hover:bg-blue-600/20 transition-colors duration-200 ${
                                  playbackRate === rate ? 'text-blue-400' : 'text-white'
                                }`}
                              >
                                {rate}x
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <button onClick={toggleFullscreen} className="text-white hover:text-blue-400 transition-colors duration-200">
                        <Maximize className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Info */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {lesson.duration}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {course.title}
                    </div>
                    {currentLessonIndex < 2 && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Bepul dars
                      </div>
                    )}
                    {lessonCompleted && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Tugallandi
                      </div>
                    )}
                  </div>
                </div>
                <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 border border-gray-300">
                  <Download className="h-4 w-4" />
                  <span>Yuklab olish</span>
                </button>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                {lesson.description}
              </p>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={onPrevLesson}
                  disabled={!prevLesson}
                  className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Oldingi dars</span>
                </button>

                <button
                  onClick={onNextLesson}
                  disabled={!nextLesson}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  <span>Keyingi dars</span>
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Course Progress */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Kurs jarayoni</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Umumiy progress</span>
                    <span className="font-semibold text-gray-900">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <div>Tugallangan: {Math.floor(allLessons.length * 0.75)}/{allLessons.length} dars</div>
                  <div>Qolgan vaqt: ~3 soat</div>
                </div>
              </div>
            </div>

            {/* Lesson List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Darslar ro'yxati</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allLessons.map((lessonItem, index) => {
                  const isAccessible = index < 2 || hasAccess;
                  return (
                    <div
                      key={lessonItem.id}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        lessonItem.id === lesson.id
                          ? 'border-blue-300 bg-blue-50'
                          : isAccessible
                          ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          lessonItem.id === lesson.id
                            ? 'bg-blue-600 text-white'
                            : isAccessible
                            ? lessonCompleted
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-200 text-gray-700'
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {lessonCompleted ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm truncate flex items-center">
                            {lessonItem.title}
                            {index < 2 && (
                              <span className="ml-2 bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                                BEPUL
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-gray-600 flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {lessonItem.duration}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;