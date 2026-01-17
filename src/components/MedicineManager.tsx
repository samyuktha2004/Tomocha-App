import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Pill, Plus, Trash2, Edit, Clock, Calendar, AlertCircle, Check } from "lucide-react";
import { useTheme } from "./ThemeContext";
import { toast } from "sonner";
import {
  Medicine,
  getMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  toggleMedicine,
  sendTestMedicineNotification,
  getNotificationSettings
} from "../utils/notificationService";

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MEDICINE_COLORS = [
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#10B981', // Green
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#14B8A6', // Teal
  '#F97316'  // Orange
];

export default function MedicineManager() {
  const { isDarkMode } = useTheme();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    times: ['09:00'],
    days: [] as string[],
    notes: '',
    color: MEDICINE_COLORS[0],
    enabled: true
  });

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = () => {
    setMedicines(getMedicines());
  };

  const resetForm = () => {
    setFormData({
      name: '',
      dosage: '',
      times: ['09:00'],
      days: [],
      notes: '',
      color: MEDICINE_COLORS[Math.floor(Math.random() * MEDICINE_COLORS.length)],
      enabled: true
    });
  };

  const handleAddMedicine = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter medicine name');
      return;
    }

    if (formData.times.length === 0) {
      toast.error('Please add at least one reminder time');
      return;
    }

    if (editingMedicine) {
      updateMedicine(editingMedicine.id, formData);
      toast.success('Medicine updated successfully! 💊');
      setEditingMedicine(null);
    } else {
      addMedicine(formData);
      toast.success('Medicine added successfully! 💊');
    }

    resetForm();
    setShowAddDialog(false);
    loadMedicines();
  };

  const handleEditMedicine = (medicine: Medicine) => {
    setFormData({
      name: medicine.name,
      dosage: medicine.dosage,
      times: medicine.times,
      days: medicine.days,
      notes: medicine.notes || '',
      color: medicine.color || MEDICINE_COLORS[0],
      enabled: medicine.enabled
    });
    setEditingMedicine(medicine);
    setShowAddDialog(true);
  };

  const handleDeleteMedicine = (id: string) => {
    deleteMedicine(id);
    toast.success('Medicine deleted');
    setDeleteConfirm(null);
    loadMedicines();
  };

  const handleToggleMedicine = (id: string) => {
    toggleMedicine(id);
    loadMedicines();
    const medicine = medicines.find(m => m.id === id);
    if (medicine) {
      toast.success(medicine.enabled ? 'Medicine reminder disabled' : 'Medicine reminder enabled');
    }
  };

  const addTime = () => {
    setFormData({ ...formData, times: [...formData.times, '12:00'] });
  };

  const removeTime = (index: number) => {
    const newTimes = formData.times.filter((_, i) => i !== index);
    setFormData({ ...formData, times: newTimes });
  };

  const updateTime = (index: number, value: string) => {
    const newTimes = [...formData.times];
    newTimes[index] = value;
    setFormData({ ...formData, times: newTimes });
  };

  const toggleDay = (day: string) => {
    const newDays = formData.days.includes(day)
      ? formData.days.filter(d => d !== day)
      : [...formData.days, day];
    setFormData({ ...formData, days: newDays });
  };

  const formatTimes = (times: string[]) => {
    return times.map(t => {
      const [hours, minutes] = t.split(':');
      const h = parseInt(hours);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayHours = h % 12 || 12;
      return `${displayHours}:${minutes} ${ampm}`;
    }).join(', ');
  };

  const formatDays = (days: string[]) => {
    if (days.length === 0 || days.length === 7) return 'Every day';
    if (days.length === 5 && !days.includes('Sat') && !days.includes('Sun')) return 'Weekdays';
    if (days.length === 2 && days.includes('Sat') && days.includes('Sun')) return 'Weekends';
    return days.join(', ');
  };

  const settings = getNotificationSettings();
  const medicineRemindersEnabled = settings.enabled && settings.medicineReminders;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg flex items-center gap-2">
            <Pill className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            Medicine Reminders
          </h3>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Never miss your medication
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setEditingMedicine(null);
            setShowAddDialog(true);
          }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Medicine
        </Button>
      </div>

      {/* Warning if notifications disabled */}
      {!medicineRemindersEnabled && (
        <Card className={`p-4 ${isDarkMode ? 'bg-amber-900/20 border-amber-700' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className={isDarkMode ? 'text-amber-300' : 'text-amber-900'}>
                Medicine reminders are currently disabled
              </p>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                Enable notifications in Settings to receive medicine reminders
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Medicine List */}
      {medicines.length === 0 ? (
        <Card className={`p-12 text-center ${isDarkMode ? 'bg-slate-800/50 border-purple-500/20' : 'bg-gray-50'}`}>
          <Pill className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            No medicines added yet
          </p>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Add your first medicine to start receiving reminders
          </p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {medicines.map((medicine) => (
            <Card
              key={medicine.id}
              className={`p-4 transition-all ${
                isDarkMode ? 'bg-slate-800/50 border-purple-500/20' : 'bg-white'
              } ${!medicine.enabled ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: medicine.color + '20' }}
                  >
                    <Pill className="w-5 h-5" style={{ color: medicine.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4>{medicine.name}</h4>
                      {medicine.dosage && (
                        <Badge variant="outline" className="text-xs">
                          {medicine.dosage}
                        </Badge>
                      )}
                    </div>
                    <div className={`space-y-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {formatTimes(medicine.times)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDays(medicine.days)}
                      </div>
                      {medicine.notes && (
                        <p className={`mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {medicine.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={medicine.enabled}
                    onCheckedChange={() => handleToggleMedicine(medicine.id)}
                    aria-label={`Toggle ${medicine.name}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditMedicine(medicine)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirm(medicine.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Test Notification Button */}
      {medicines.length > 0 && medicineRemindersEnabled && (
        <Button
          variant="outline"
          onClick={() => {
            sendTestMedicineNotification();
            toast.success('Test notification sent!');
          }}
          className="w-full"
        >
          Send Test Notification
        </Button>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className={`max-w-md max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
          <DialogHeader>
            <DialogTitle>
              {editingMedicine ? 'Edit Medicine' : 'Add Medicine'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Medicine Name */}
            <div>
              <label className="text-sm mb-2 block">Medicine Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Vitamin D"
                className={isDarkMode ? 'bg-slate-800' : ''}
              />
            </div>

            {/* Dosage */}
            <div>
              <label className="text-sm mb-2 block">Dosage</label>
              <Input
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                placeholder="e.g., 500mg"
                className={isDarkMode ? 'bg-slate-800' : ''}
              />
            </div>

            {/* Reminder Times */}
            <div>
              <label className="text-sm mb-2 block">Reminder Times *</label>
              <div className="space-y-2">
                {formData.times.map((time, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => updateTime(index, e.target.value)}
                      className={`flex-1 ${isDarkMode ? 'bg-slate-800' : ''}`}
                    />
                    {formData.times.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTime(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addTime}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Time
                </Button>
              </div>
            </div>

            {/* Days of Week */}
            <div>
              <label className="text-sm mb-2 block">Days (Leave empty for every day)</label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map(day => (
                  <Button
                    key={day}
                    variant={formData.days.includes(day) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleDay(day)}
                    className={formData.days.includes(day) ? 'bg-purple-600 hover:bg-purple-700' : ''}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="text-sm mb-2 block">Color</label>
              <div className="flex gap-2 flex-wrap">
                {MEDICINE_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full transition-all ${
                      formData.color === color ? 'ring-2 ring-offset-2 ring-purple-500' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm mb-2 block">Notes (Optional)</label>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g., Take with food"
                className={isDarkMode ? 'bg-slate-800' : ''}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  resetForm();
                  setEditingMedicine(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddMedicine}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                {editingMedicine ? 'Update' : 'Add'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className={isDarkMode ? 'bg-slate-900' : 'bg-white'}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medicine?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this medicine and its reminders. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDeleteMedicine(deleteConfirm)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
