'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  MapPin,
  BookOpen,
  Users,
  Video,
  User
} from 'lucide-react';
import type { 
  ContributionFormData, 
  ContributionType,
  ContributionResponse 
} from '@/lib/types/contribution';
import { CONTRIBUTION_STEPS, REGIONS, VIDEO_TYPES } from '@/lib/types/contribution';

const STEP_ICONS = [MapPin, MapPin, BookOpen, Users, Video, User];

const initialFormData: ContributionFormData = {
  type: 'new_location',
  contributor: { name: '', email: '' },
  locationName: '',
  description: '',
  quickFacts: [],
};

export default function ContributionForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ContributionFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<ContributionResponse | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('contributionDraft');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch {
        // Invalid saved data
      }
    }
  }, []);

  useEffect(() => {
    if (formData.locationName || formData.description) {
      localStorage.setItem('contributionDraft', JSON.stringify(formData));
    }
  }, [formData]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.locationName.trim()) {
        newErrors.locationName = 'Location name is required';
      }
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      } else if (formData.description.trim().length < 50) {
        newErrors.description = 'Description must be at least 50 characters';
      }
    }

    if (step === 5) {
      if (!formData.contributor.name.trim()) {
        newErrors.contributorName = 'Name is required';
      }
      if (!formData.contributor.email.trim()) {
        newErrors.contributorEmail = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contributor.email)) {
        newErrors.contributorEmail = 'Invalid email format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, CONTRIBUTION_STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result: ContributionResponse = await response.json();
      setSubmitResult(result);

      if (result.success) {
        localStorage.removeItem('contributionDraft');
      }
    } catch {
      setSubmitResult({
        success: false,
        message: 'Network error. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = <K extends keyof ContributionFormData>(
    key: K,
    value: ContributionFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error for this field
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <StepType formData={formData} updateFormData={updateFormData} />;
      case 1:
        return <StepBasics formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 2:
        return <StepLore formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <StepPeople formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <StepMedia formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <StepContributor formData={formData} updateFormData={updateFormData} errors={errors} />;
      default:
        return null;
    }
  };

  if (submitResult?.success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-4">Check Your Email! 📧</h2>
        <p className="text-gray-300 max-w-md mx-auto">
          We&apos;ve sent a verification email to <strong>{formData.contributor.email}</strong>.
          Click the link in the email to complete your contribution.
        </p>
        <p className="text-gray-500 mt-4 text-sm">
          The link will expire in 24 hours.
        </p>
        <button
          onClick={() => {
            setFormData(initialFormData);
            setCurrentStep(0);
            setSubmitResult(null);
          }}
          className="mt-8 px-6 py-3 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
        >
          Submit Another Contribution
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {CONTRIBUTION_STEPS.map((step, index) => {
            const Icon = STEP_ICONS[index];
            return (
              <button
                key={step.id}
                onClick={() => index < currentStep && setCurrentStep(index)}
                disabled={index > currentStep}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-yellow-500 text-black'
                    : index < currentStep
                    ? 'bg-green-500/20 text-green-400 cursor-pointer hover:bg-green-500/30'
                    : 'bg-gray-800 text-gray-500'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </button>
            );
          })}
        </div>
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / CONTRIBUTION_STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">
          {CONTRIBUTION_STEPS[currentStep].title}
        </h2>
        <p className="text-gray-400">
          {CONTRIBUTION_STEPS[currentStep].description}
        </p>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="min-h-[300px]"
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {/* Error message */}
      {submitResult && !submitResult.success && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-4"
        >
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-red-300">{submitResult.message}</p>
        </motion.div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-800">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        {currentStep === CONTRIBUTION_STEPS.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-yellow-300 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Contribution
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

// Step Components
interface StepProps {
  formData: ContributionFormData;
  updateFormData: <K extends keyof ContributionFormData>(key: K, value: ContributionFormData[K]) => void;
  errors?: Record<string, string>;
}

function StepType({ formData, updateFormData }: StepProps) {
  const types: { value: ContributionType; label: string; icon: string; desc: string }[] = [
    { value: 'new_location', label: 'New Location', icon: '🏝️', desc: 'Add an island or location not yet on the map' },
    { value: 'edit_location', label: 'Edit Existing', icon: '✏️', desc: 'Improve or correct existing location info' },
    { value: 'lore_correction', label: 'Lore Correction', icon: '📜', desc: 'Fix inaccurate lore or details' },
  ];

  return (
    <div className="space-y-3">
      {types.map((type) => (
        <button
          key={type.value}
          onClick={() => updateFormData('type', type.value)}
          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
            formData.type === type.value
              ? 'border-yellow-500 bg-yellow-500/10'
              : 'border-gray-700 hover:border-gray-600'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{type.icon}</span>
            <div>
              <div className="font-semibold text-white">{type.label}</div>
              <div className="text-sm text-gray-400">{type.desc}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function StepBasics({ formData, updateFormData, errors = {} }: StepProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Location Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={formData.locationName}
          onChange={(e) => updateFormData('locationName', e.target.value)}
          placeholder="e.g., Elbaf, God Valley, Laugh Tale"
          className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 ${
            errors.locationName ? 'border-red-500' : 'border-gray-700'
          }`}
        />
        {errors.locationName && (
          <p className="text-red-400 text-sm mt-1">{errors.locationName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Region
        </label>
        <select
          value={formData.region || ''}
          onChange={(e) => updateFormData('region', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
        >
          <option value="">Select a region...</option>
          {REGIONS.map((region) => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          placeholder="Describe this location in 2-3 sentences. What makes it special?"
          rows={4}
          className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 resize-none ${
            errors.description ? 'border-red-500' : 'border-gray-700'
          }`}
        />
        <div className="flex justify-between text-sm mt-1">
          {errors.description ? (
            <p className="text-red-400">{errors.description}</p>
          ) : (
            <span className="text-gray-500">Minimum 50 characters</span>
          )}
          <span className={formData.description.length >= 50 ? 'text-green-400' : 'text-gray-500'}>
            {formData.description.length}/50
          </span>
        </div>
      </div>
    </div>
  );
}

function StepLore({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-400 text-sm mb-4">
        These fields are optional but help make the location more complete.
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          History
        </label>
        <textarea
          value={formData.history || ''}
          onChange={(e) => updateFormData('history', e.target.value)}
          placeholder="Tell us about this location's history, major events, and significance in the One Piece world..."
          rows={4}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Culture
        </label>
        <textarea
          value={formData.culture || ''}
          onChange={(e) => updateFormData('culture', e.target.value)}
          placeholder="Describe the local culture, customs, traditions, and way of life..."
          rows={4}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Transportation
        </label>
        <input
          type="text"
          value={formData.transportation || ''}
          onChange={(e) => updateFormData('transportation', e.target.value)}
          placeholder="How do people travel around or reach this location?"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
        />
      </div>
    </div>
  );
}

function StepPeople({ formData, updateFormData }: StepProps) {
  const people = formData.notablePeople || [];

  const addPerson = () => {
    updateFormData('notablePeople', [...people, { name: '', role: '', description: '' }]);
  };

  const updatePerson = (index: number, field: string, value: string) => {
    const updated = [...people];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData('notablePeople', updated);
  };

  const removePerson = (index: number) => {
    updateFormData('notablePeople', people.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-400 text-sm mb-4">
        Add notable characters associated with this location.
      </p>

      {people.map((person, index) => (
        <div key={index} className="p-4 bg-gray-800/30 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-300">Character {index + 1}</span>
            <button
              onClick={() => removePerson(index)}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Remove
            </button>
          </div>
          <input
            type="text"
            value={person.name}
            onChange={(e) => updatePerson(index, 'name', e.target.value)}
            placeholder="Character name"
            className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
          />
          <input
            type="text"
            value={person.role}
            onChange={(e) => updatePerson(index, 'role', e.target.value)}
            placeholder="Role or title"
            className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
          />
          <textarea
            value={person.description}
            onChange={(e) => updatePerson(index, 'description', e.target.value)}
            placeholder="Brief description"
            rows={2}
            className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm resize-none"
          />
        </div>
      ))}

      <button
        onClick={addPerson}
        className="w-full py-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:border-gray-600 hover:text-gray-300 transition-colors"
      >
        + Add Character
      </button>
    </div>
  );
}

function StepMedia({ formData, updateFormData }: StepProps) {
  const videos = formData.videos || [];
  const quickFacts = formData.quickFacts || [];
  const [newFact, setNewFact] = useState('');

  const addVideo = () => {
    updateFormData('videos', [...videos, { youtubeId: '', title: '', type: 'lore' as const }]);
  };

  const updateVideo = (index: number, field: string, value: string) => {
    const updated = [...videos];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData('videos', updated);
  };

  const removeVideo = (index: number) => {
    updateFormData('videos', videos.filter((_, i) => i !== index));
  };

  const addFact = () => {
    if (newFact.trim()) {
      updateFormData('quickFacts', [...quickFacts, newFact.trim()]);
      setNewFact('');
    }
  };

  const removeFact = (index: number) => {
    updateFormData('quickFacts', quickFacts.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Quick Facts */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Quick Facts
        </label>
        <p className="text-gray-500 text-xs mb-2">
          Fun facts that appear when hovering over the location
        </p>
        <div className="space-y-2 mb-2">
          {quickFacts.map((fact, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-800/30 rounded">
              <span className="flex-1 text-sm text-gray-300">{fact}</span>
              <button onClick={() => removeFact(index)} className="text-red-400 text-sm">×</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newFact}
            onChange={(e) => setNewFact(e.target.value)}
            placeholder="Add a fun fact..."
            className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm"
            onKeyDown={(e) => e.key === 'Enter' && addFact()}
          />
          <button
            onClick={addFact}
            className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm"
          >
            Add
          </button>
        </div>
      </div>

      {/* Videos */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          YouTube Videos
        </label>
        <p className="text-gray-500 text-xs mb-2">
          Get the video ID from YouTube URL: youtube.com/watch?v=<strong>VIDEO_ID</strong>
        </p>

        {videos.map((video, index) => (
          <div key={index} className="p-4 bg-gray-800/30 rounded-lg space-y-2 mb-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Video {index + 1}</span>
              <button onClick={() => removeVideo(index)} className="text-red-400 text-sm">Remove</button>
            </div>
            <input
              type="text"
              value={video.youtubeId}
              onChange={(e) => updateVideo(index, 'youtubeId', e.target.value)}
              placeholder="YouTube Video ID (e.g., dQw4w9WgXcQ)"
              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded text-white text-sm"
            />
            <input
              type="text"
              value={video.title}
              onChange={(e) => updateVideo(index, 'title', e.target.value)}
              placeholder="Video title"
              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded text-white text-sm"
            />
            <select
              value={video.type}
              onChange={(e) => updateVideo(index, 'type', e.target.value)}
              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded text-white text-sm"
            >
              {VIDEO_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        ))}

        <button
          onClick={addVideo}
          className="w-full py-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:border-gray-600 transition-colors"
        >
          + Add Video
        </button>
      </div>
    </div>
  );
}

function StepContributor({ formData, updateFormData, errors = {} }: StepProps) {
  const updateContributor = (field: string, value: string) => {
    updateFormData('contributor', { ...formData.contributor, [field]: value });
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-400 text-sm mb-4">
        We&apos;ll send a verification email to confirm your contribution. You&apos;ll be credited when approved!
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Your Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={formData.contributor.name}
          onChange={(e) => updateContributor('name', e.target.value)}
          placeholder="How should we credit you?"
          className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 ${
            errors.contributorName ? 'border-red-500' : 'border-gray-700'
          }`}
        />
        {errors.contributorName && (
          <p className="text-red-400 text-sm mt-1">{errors.contributorName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          type="email"
          value={formData.contributor.email}
          onChange={(e) => updateContributor('email', e.target.value)}
          placeholder="your@email.com"
          className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 ${
            errors.contributorEmail ? 'border-red-500' : 'border-gray-700'
          }`}
        />
        {errors.contributorEmail && (
          <p className="text-red-400 text-sm mt-1">{errors.contributorEmail}</p>
        )}
        <p className="text-gray-500 text-sm mt-1">
          We&apos;ll send a verification link to this email
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Discord Handle (optional)
        </label>
        <input
          type="text"
          value={formData.contributor.discordHandle || ''}
          onChange={(e) => updateContributor('discordHandle', e.target.value)}
          placeholder="username#1234"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
        />
      </div>
    </div>
  );
}
