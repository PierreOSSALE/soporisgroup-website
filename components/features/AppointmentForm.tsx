// components/features/AppointmentForm.tsx
"use client";

import { useFormState } from "react-dom";
import { createAppointment } from "@/lib/actions/appointment.actions";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const initialState = {
  success: false,
  message: "",
  error: "",
};

export function AppointmentForm() {
  const [state, formAction] = useFormState(createAppointment, initialState);

  useEffect(() => {
    if (state.success) {
      toast({ title: "Succès", description: state.message });
    } else if (state.error) {
      toast({
        title: "Erreur",
        description: state.error,
        variant: "destructive",
      });
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      {/* Vos inputs ici avec name="name", name="email", etc. */}
      <input name="name" required placeholder="Nom" className="..." />
      {/* ... */}
      <button type="submit">Confirmer le RDV</button>
    </form>
  );
}
