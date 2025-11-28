import { useState, useEffect } from 'react';
import { storage, TrustedContact } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Trash2, Edit, Plus, X, Phone, Mail, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function TrustedContacts() {
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    contactInfo: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    const allContacts = await storage.getTrustedContacts();
    setContacts(allContacts);
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.relationship) {
      toast.error('Please fill name and relationship');
      return;
    }

    if (!formData.phone && !formData.email && !formData.contactInfo) {
      toast.error('Please provide at least one contact method');
      return;
    }

    const contactData = {
      name: formData.name,
      relationship: formData.relationship,
      contactInfo: formData.contactInfo || formData.phone || formData.email,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
    };

    if (editingId) {
      await storage.updateTrustedContact(editingId, contactData);
      toast.success('Contact updated!');
    } else {
      await storage.addTrustedContact(contactData);
      toast.success('Contact added!');
    }

    setFormData({ name: '', relationship: '', contactInfo: '', phone: '', email: '' });
    setIsAdding(false);
    setEditingId(null);
    await loadContacts();
  };

  const handleEdit = (contact: TrustedContact) => {
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      contactInfo: contact.contactInfo || '',
      phone: contact.phone || '',
      email: contact.email || '',
    });
    setEditingId(contact.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Remove this contact?')) {
      await storage.deleteTrustedContact(id);
      toast.success('Contact removed');
      await loadContacts();
    }
  };

  const handleEmergencyContact = (contact: TrustedContact) => {
    const phone = contact.phone || contact.contactInfo;
    if (phone) {
      window.location.href = `tel:${phone.replace(/[^0-9+]/g, '')}`;
      toast.success(`Calling ${contact.name}...`);
    } else if (contact.email) {
      window.location.href = `mailto:${contact.email}`;
      toast.success(`Opening email to ${contact.name}...`);
    } else {
      toast.error('No contact method available');
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', relationship: '', contactInfo: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2 pt-8">
          <Users className="h-12 w-12 text-primary mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-foreground">Trusted Contacts</h1>
          <p className="text-muted-foreground">People you can reach out to for support</p>
        </div>

        {/* Add/Edit Form */}
        {isAdding ? (
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                {editingId ? 'Edit Contact' : 'Add Contact'}
              </h2>
              <Button variant="ghost" size="icon" onClick={handleCancel}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Mom, Sarah, Dr. Smith"
                />
              </div>

              <div>
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  id="relationship"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  placeholder="e.g., Mother, Best Friend, Therapist"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g., +1234567890"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g., email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="contact">Other Contact Info (Optional)</Label>
                <Input
                  id="contact"
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                  placeholder="Additional contact information"
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleAdd} className="flex-1">
                  {editingId ? 'Update Contact' : 'Add Contact'}
                </Button>
                <Button variant="outline" onClick={handleCancel} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button onClick={() => setIsAdding(true)} className="w-full" size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Add Trusted Contact
          </Button>
        )}

        {/* Contacts List */}
        <div className="space-y-4">
          {contacts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p>No trusted contacts yet.</p>
              <p className="text-sm">Add people you can reach out to when you need support.</p>
            </div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-card border border-border rounded-xl p-5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(contact)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(contact.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                      className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      {contact.phone}
                    </a>
                  )}
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {contact.email}
                    </a>
                  )}
                  {contact.contactInfo && !contact.phone && !contact.email && (
                    <a
                      href={
                        contact.contactInfo.includes('@')
                          ? `mailto:${contact.contactInfo}`
                          : `tel:${contact.contactInfo}`
                      }
                      className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg text-primary hover:bg-primary/20 transition-colors"
                    >
                      {contact.contactInfo.includes('@') ? (
                        <Mail className="h-4 w-4" />
                      ) : (
                        <Phone className="h-4 w-4" />
                      )}
                      {contact.contactInfo}
                    </a>
                  )}
                </div>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleEmergencyContact(contact)}
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Emergency Contact
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
