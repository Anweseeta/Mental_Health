import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Wind, Anchor, AlertCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storage, TrustedContact } from '@/lib/storage';

export default function Crisis() {
  const [step, setStep] = useState<'initial' | 'breathing' | 'grounding'>('initial');
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadTrustedContacts();
  }, []);

  const loadTrustedContacts = async () => {
    const contacts = await storage.getTrustedContacts();
    setTrustedContacts(contacts);
  };

  const handleContactTrustedPerson = (contact: TrustedContact) => {
    const phone = contact.phone || contact.contactInfo;
    if (phone) {
      window.location.href = `tel:${phone.replace(/[^0-9+]/g, '')}`;
    } else if (contact.email) {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  const hotlines = [
    {
      name: '988 Suicide & Crisis Lifeline',
      number: '988',
      description: 'Free and confidential support 24/7',
    },
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Text with a trained crisis counselor',
    },
    {
      name: 'SAMHSA National Helpline',
      number: '1-800-662-4357',
      description: 'Treatment referral and information',
    },
  ];

  if (step === 'initial') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-secondary">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-4">
            <AlertCircle className="h-20 w-20 text-destructive mx-auto" />
            <h1 className="text-4xl font-bold text-foreground">Crisis Support</h1>
            <p className="text-lg text-muted-foreground">
              You're not alone. Let's take this one step at a time.
            </p>
          </div>

          <div className="bg-card border-2 border-destructive rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-bold text-foreground text-center">
              Emergency Hotlines
            </h2>
            <div className="space-y-4">
              {hotlines.map((hotline) => (
                <a
                  key={hotline.number}
                  href={`tel:${hotline.number.replace(/[^0-9]/g, '')}`}
                  className="flex items-start gap-4 p-4 bg-destructive/10 hover:bg-destructive/20 rounded-xl border border-destructive/30 transition-colors"
                >
                  <Phone className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">{hotline.name}</p>
                    <p className="text-2xl font-bold text-destructive">{hotline.number}</p>
                    <p className="text-sm text-muted-foreground">{hotline.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Trusted Contacts */}
          {trustedContacts.length > 0 && (
            <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-semibold text-foreground text-center flex items-center justify-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Your Trusted Contacts
              </h3>
              <div className="space-y-3">
                {trustedContacts.map((contact) => (
                  <Button
                    key={contact.id}
                    variant="secondary"
                    className="w-full h-auto py-4"
                    onClick={() => handleContactTrustedPerson(contact)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Phone className="h-5 w-5 text-primary" />
                      <div className="text-left flex-1">
                        <p className="font-semibold">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center text-foreground">
              Or try these calming techniques
            </h3>
            <div className="grid gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="w-full h-auto py-6"
                onClick={() => setStep('breathing')}
              >
                <div className="flex items-center gap-3">
                  <Wind className="h-6 w-6 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold">Start Breathing Exercise</p>
                    <p className="text-sm text-muted-foreground">Calm your nervous system</p>
                  </div>
                </div>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="w-full h-auto py-6"
                onClick={() => setStep('grounding')}
              >
                <div className="flex items-center gap-3">
                  <Anchor className="h-6 w-6 text-teal-500" />
                  <div className="text-left">
                    <p className="font-semibold">Try Grounding Exercise</p>
                    <p className="text-sm text-muted-foreground">Connect with the present</p>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'breathing') {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="max-w-md w-full space-y-6">
          <h2 className="text-2xl font-bold text-center text-foreground">
            Let's breathe together
          </h2>
          <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-6">
            <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-blue-600 animate-breathing flex items-center justify-center">
              <p className="text-white text-2xl font-bold">Breathe In</p>
            </div>
            <p className="text-muted-foreground">Follow the circle's rhythm</p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep('initial')} className="flex-1">
                Back
              </Button>
              <Button onClick={() => navigate('/tools/breathing')} className="flex-1">
                Full Exercise
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <h2 className="text-2xl font-bold text-center text-foreground">
          Let's ground ourselves
        </h2>
        <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">5 Things You Can See</h3>
            <p className="text-muted-foreground">
              Look around and name 5 things you can see right now. Take your time.
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStep('initial')} className="flex-1">
              Back
            </Button>
            <Button onClick={() => navigate('/tools/grounding')} className="flex-1">
              Full Exercise
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
