import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function Grounding() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: '5 Things You Can See',
      prompt: 'Look around and name 5 things you can see right now',
      examples: ['A lamp', 'A book', 'The wall', 'Your phone', 'A plant'],
    },
    {
      title: '4 Things You Can Touch',
      prompt: 'Name 4 things you can physically feel or touch',
      examples: ['Your clothes', 'The chair', 'Your hair', 'The floor'],
    },
    {
      title: '3 Things You Can Hear',
      prompt: 'Listen carefully and identify 3 sounds',
      examples: ['Birds chirping', 'Traffic', 'Your breathing'],
    },
    {
      title: '2 Things You Can Smell',
      prompt: 'Notice 2 scents around you',
      examples: ['Coffee', 'Fresh air'],
    },
    {
      title: '1 Thing You Can Taste',
      prompt: 'Focus on 1 thing you can taste',
      examples: ['Mint from toothpaste'],
    },
    {
      title: 'Well Done! 🎉',
      prompt: 'You\'ve completed the grounding exercise',
      examples: [],
    },
  ];

  const currentStep = steps[step];
  const isComplete = step === steps.length - 1;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Grounding Exercise</h1>
          <p className="text-muted-foreground">Connect with the present moment</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-all ${
                index <= step ? 'bg-primary' : 'bg-secondary'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-card border border-border rounded-2xl p-8 space-y-6 min-h-[400px] flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">{currentStep.title}</h2>
            <p className="text-lg text-muted-foreground">{currentStep.prompt}</p>

            {currentStep.examples.length > 0 && (
              <div className="space-y-3 pt-4">
                <p className="text-sm text-muted-foreground font-medium">Examples:</p>
                {currentStep.examples.map((example, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-secondary rounded-lg"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{example}</span>
                  </div>
                ))}
              </div>
            )}

            {isComplete && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🌟</div>
                <p className="text-muted-foreground">
                  You've successfully grounded yourself in the present moment. 
                  How are you feeling now?
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-4 justify-between pt-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="w-32"
            >
              <ChevronLeft className="mr-2 h-5 w-5" />
              Previous
            </Button>
            <Button
              size="lg"
              onClick={() => step < steps.length - 1 && setStep(step + 1)}
              disabled={isComplete}
              className="w-32"
            >
              {isComplete ? 'Complete' : 'Next'}
              {!isComplete && <ChevronRight className="ml-2 h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
