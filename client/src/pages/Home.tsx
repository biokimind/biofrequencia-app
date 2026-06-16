import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Volume2, Lock, Heart } from 'lucide-react';

// Frequências Solfeggio
const SOLFEGGIO_PRESETS = [
  { name: '174 Hz', value: 174, description: 'Alívio da Dor' },
  { name: '285 Hz', value: 285, description: 'Cura Energética' },
  { name: '396 Hz', value: 396, description: 'Libertação' },
  { name: '417 Hz', value: 417, description: 'Transmutação' },
  { name: '528 Hz', value: 528, description: 'Frequência do Amor' },
  { name: '639 Hz', value: 639, description: 'Conexão' },
  { name: '741 Hz', value: 741, description: 'Expressão' },
  { name: '852 Hz', value: 852, description: 'Intuição' },
  { name: '963 Hz', value: 963, description: 'Ativação' },
];

// Frequências Rife (amostra)
const RIFE_PRESETS = [
  { name: '2.5 Hz', value: 2.5, description: 'Sedativo' },
  { name: '10 Hz', value: 10, description: 'Relaxamento' },
  { name: '40 Hz', value: 40, description: 'Foco' },
  { name: '432 Hz', value: 432, description: 'Harmonia' },
];

export default function Home() {
  const [frequency, setFrequency] = useState<number>(528);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isPremium] = useState(false); // Simular versão gratuita
  const [volume, setVolume] = useState(0.3);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const maxDuration = isPremium ? 300 : 30; // 5 min premium, 30s gratuita

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopAudio();
    };
  }, []);

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            stopAudio();
            return maxDuration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, timeRemaining, maxDuration]);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const playAudio = () => {
    const audioContext = initAudioContext();

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    // Criar oscilador
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();

    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      setTimeRemaining(maxDuration);
      playAudio();
    }
  };

  const reset = () => {
    stopAudio();
    setTimeRemaining(maxDuration);
  };

  const handlePresetClick = (value: number) => {
    setFrequency(value);
    if (isPlaying) {
      stopAudio();
      setTimeout(() => playAudio(), 100);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section com Background */}
      <div 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4 md:p-8"
        style={{
          backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310419663029688254/kWAnGRJj4XQc9SXVjW5xqo/hero-biofrequencia-MjKnr9YM4zESZUJXwhpgMk.webp)',
        }}
      >
        {/* Overlay para melhor legibilidade */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto text-center mb-8">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-md mb-6 shadow-xl border border-white/20">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029688254/kWAnGRJj4XQc9SXVjW5xqo/app-logo-biofrequencia-aBLrLCNHbY86VvLZGY5KKF.webp"
              alt="Biofrequência Logo"
              className="w-12 h-12"
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 drop-shadow-lg">
            Biofrequência
          </h1>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow-md">
            Crie sua frequência perfeita
          </p>
        </div>

        {/* Main Card - Posicionado sobre o hero */}
        <div className="relative z-10 w-full max-w-2xl">
          <Card className="p-8 shadow-2xl border-0 bg-white/95 backdrop-blur-md">
            {/* Frequency Input */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-muted-foreground mb-3">
                Frequência (Hz)
              </label>
              <div className="flex gap-3">
                <Input
                  type="number"
                  value={frequency}
                  onChange={(e) => setFrequency(Number(e.target.value))}
                  className="text-2xl font-mono text-center py-6 rounded-2xl border-2 border-secondary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  min="0.1"
                  step="0.1"
                />
                {!isPremium && (
                  <div className="flex items-center gap-2 px-4 bg-muted rounded-2xl">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">30s</span>
                  </div>
                )}
              </div>
            </div>

            {/* Waveform Visualizer */}
            <div className="mb-8 p-6 bg-gradient-to-b from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 overflow-hidden">
              <svg
                className="w-full h-24"
                viewBox="0 0 400 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgb(139, 127, 216)" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="rgb(78, 205, 196)" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                {/* Animated wave */}
                <path
                  d={generateWavePath(isPlaying ? frequency : 0)}
                  fill="url(#waveGradient)"
                  stroke="rgb(139, 127, 216)"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* Timer */}
            <div className="text-center mb-8">
              <div className="text-6xl font-mono font-bold text-primary mb-2">
                {formatTime(timeRemaining)}
              </div>
              <p className="text-sm text-muted-foreground">
                {isPremium ? 'Versão Premium - Sem limite' : 'Versão Gratuita - 30 segundos'}
              </p>
            </div>

            {/* Volume Control */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-muted-foreground mb-3">
                Volume: {Math.round(volume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => {
                  const newVolume = Number(e.target.value);
                  setVolume(newVolume);
                  if (gainNodeRef.current) {
                    gainNodeRef.current.gain.value = newVolume;
                  }
                }}
                className="w-full h-2 bg-secondary/20 rounded-full appearance-none cursor-pointer"
              />
            </div>

            {/* Aviso sobre Frequências Inaudíveis */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 mb-6">
              <p><strong>ℹ️ Nota sobre Frequências:</strong> O ouvido humano percebe frequências entre aproximadamente <strong>20 Hz e 20.000 Hz</strong>. Frequências abaixo de 20 Hz (infrasom) e acima de 20.000 Hz (ultrassom) podem ser inaudíveis, mas ainda podem ter efeitos biológicos. A idade reduz a percepção de frequências altas.</p>
            </div>

            {/* Controls */}
            <div className="flex gap-3 mb-8">
              <Button
                onClick={togglePlayPause}
                size="lg"
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-300 text-white rounded-2xl py-6 text-lg font-semibold"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pausar
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Reproduzir
                  </>
                )}
              </Button>
              <Button
                onClick={reset}
                variant="outline"
                size="lg"
                className="rounded-2xl py-6 border-2 border-primary/20 hover:bg-primary/10"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>

            {/* Safety Warning */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
              <p className="font-semibold mb-2">⚠️ Aviso de Segurança</p>
              <ul className="space-y-1 list-disc list-inside">
                <li><strong>Não use</strong> se possui marcapasso ou implantes eletrônicos</li>
                <li><strong>Não use</strong> se possui epilepsia ou sensibilidade a estímulos auditivos</li>
                <li><strong>Não use</strong> durante a gravidez sem orientação médica</li>
                <li><strong>Consulte</strong> um profissional de saúde antes de usar biofrequências</li>
                <li><strong>Não use</strong> enquanto dirige ou opera máquinas</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>

      {/* Presets Section */}
      <div className="bg-gradient-to-b from-background to-secondary/5 py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-primary mb-2">Frequências Solfeggio</h2>
            <p className="text-muted-foreground">Frequências sagradas para cura e harmonia</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-12">
            {SOLFEGGIO_PRESETS.map((preset) => (
              <Button
                key={preset.value}
                onClick={() => handlePresetClick(preset.value)}
                variant={frequency === preset.value ? 'default' : 'outline'}
                className={`rounded-xl py-4 transition-all duration-200 h-auto flex flex-col items-center justify-center ${
                  frequency === preset.value
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                    : 'border-primary/20 hover:border-primary/50'
                }`}
              >
                <div className="text-center">
                  <div className="font-mono font-bold text-sm">{preset.name}</div>
                  <div className="text-xs opacity-75">{preset.description}</div>
                </div>
              </Button>
            ))}
          </div>

          {/* Frequências Rife */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-primary mb-2">Frequências Rife</h2>
            <p className="text-muted-foreground">Frequências de pesquisa para bem-estar</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            {RIFE_PRESETS.map((preset) => (
              <Button
                key={preset.value}
                onClick={() => handlePresetClick(preset.value)}
                variant={frequency === preset.value ? 'default' : 'outline'}
                className={`rounded-xl py-4 transition-all duration-200 h-auto flex flex-col items-center justify-center ${
                  frequency === preset.value
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                    : 'border-primary/20 hover:border-primary/50'
                }`}
              >
                <div className="text-center">
                  <div className="font-mono font-bold text-sm">{preset.name}</div>
                  <div className="text-xs opacity-75">{preset.description}</div>
                </div>
              </Button>
            ))}
          </div>

          {/* Chakra Visualization */}
          <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-primary mb-3">Chakras e Frequências</h3>
              <p className="text-muted-foreground mb-4">
                Cada chakra vibra em uma frequência específica. Use as frequências correspondentes para equilibrar seus centros energéticos.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>🔴 <strong>Raiz (396 Hz)</strong> - Estabilidade e segurança</li>
                <li>🟠 <strong>Sacral (417 Hz)</strong> - Criatividade e sexualidade</li>
                <li>🟡 <strong>Plexo Solar (528 Hz)</strong> - Poder pessoal</li>
                <li>💚 <strong>Coração (639 Hz)</strong> - Amor e compaixão</li>
                <li>🔵 <strong>Garganta (741 Hz)</strong> - Expressão e comunicação</li>
                <li>🟣 <strong>Terceiro Olho (852 Hz)</strong> - Intuição e sabedoria</li>
                <li>🟣 <strong>Coroa (963 Hz)</strong> - Conexão espiritual</li>
              </ul>
            </div>
            <div className="flex-1 flex justify-center">
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029688254/kWAnGRJj4XQc9SXVjW5xqo/chakra-frequencies-Mu9s9sjJtuoWVx9SCDcnJD.webp"
                alt="Chakra Frequencies"
                className="max-w-sm w-full rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Premium CTA Section */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 py-16 px-4 md:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-primary mb-3">
              Desbloqueie a Versão Premium
            </h3>
            <p className="text-muted-foreground mb-6 text-lg">
              Crie frequências de até 5 minutos, acesse todas as frequências Rife e exporte áudio em alta qualidade.
            </p>
            <Button className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl px-8 py-6 text-lg font-semibold">
              Atualizar para Premium
            </Button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-foreground/5 py-8 px-4 md:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p className="mb-2">
            Biofrequência App by <strong>Sílvia Zacharia</strong>
          </p>
          <p className="mb-4">
            Parte da série <strong>EU SOU</strong> - Pílulas Homeopáticas Vibracionais
          </p>
          <p>
            <a href="#" className="text-primary hover:underline">E-book no Eduzz</a> • 
            <a href="#" className="text-primary hover:underline ml-2">YouTube</a> • 
            <a href="#" className="text-primary hover:underline ml-2">Instituto Elevar</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

// Função para gerar o caminho da onda
function generateWavePath(frequency: number): string {
  const points = [];
  const amplitude = 40;
  const width = 400;
  const height = 100;
  const centerY = height / 2;

  // Ajustar o número de ciclos baseado na frequência
  const cycles = Math.max(1, Math.min(5, frequency / 100));

  for (let x = 0; x <= width; x += 1) {
    const normalizedX = (x / width) * cycles * Math.PI * 2;
    const y = centerY + Math.sin(normalizedX) * amplitude;
    points.push(`${x},${y}`);
  }

  return `M ${points.join(' L ')}`;
}
