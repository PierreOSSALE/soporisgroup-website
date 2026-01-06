//app/(admin)/admin-faq/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import {
  mockFAQs,
  type AdminFAQ as AdminFAQType,
} from "@/components/data/mockAdminData";
import { useToast } from "@/hooks/use-toast";

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState<AdminFAQType[]>(mockFAQs);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<AdminFAQType | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
    order: 1,
    isActive: true,
  });

  const handleOpenDialog = (faq?: AdminFAQType) => {
    if (faq) {
      setEditingFAQ(faq);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        order: faq.order,
        isActive: faq.isActive,
      });
    } else {
      setEditingFAQ(null);
      setFormData({
        question: "",
        answer: "",
        category: "",
        order: faqs.length + 1,
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingFAQ) {
      setFaqs(
        faqs.map((f) => (f.id === editingFAQ.id ? { ...f, ...formData } : f))
      );
      toast({
        title: "FAQ modifiée",
        description: "La question a été mise à jour avec succès.",
      });
    } else {
      const newFAQ: AdminFAQType = {
        id: Date.now().toString(),
        ...formData,
      };
      setFaqs([...faqs, newFAQ]);
      toast({
        title: "FAQ créée",
        description: "La nouvelle question a été ajoutée avec succès.",
      });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setFaqs(faqs.filter((f) => f.id !== id));
    toast({
      title: "FAQ supprimée",
      description: "La question a été supprimée avec succès.",
      variant: "destructive",
    });
  };

  const toggleActive = (id: string) => {
    setFaqs(
      faqs.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f))
    );
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingFAQ ? "Modifier la FAQ" : "Nouvelle FAQ"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Input
                    id="question"
                    value={formData.question}
                    onChange={(e) =>
                      setFormData({ ...formData, question: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="answer">Réponse</Label>
                  <Textarea
                    id="answer"
                    rows={4}
                    value={formData.answer}
                    onChange={(e) =>
                      setFormData({ ...formData, answer: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Général">Général</SelectItem>
                        <SelectItem value="Services">Services</SelectItem>
                        <SelectItem value="Processus">Processus</SelectItem>
                        <SelectItem value="Paiement">Paiement</SelectItem>
                        <SelectItem value="Technique">Technique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order">Ordre</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          order: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="active">FAQ active</Label>
                  <Switch
                    id="active"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isActive: checked })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button onClick={handleSubmit}>
                  {editingFAQ ? "Enregistrer" : "Créer"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Actif</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs
                  .sort((a, b) => a.order - b.order)
                  .map((faq) => (
                    <TableRow key={faq.id}>
                      <TableCell>
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{faq.question}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {faq.answer}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">
                          {faq.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={faq.isActive}
                          onCheckedChange={() => toggleActive(faq.id)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(faq)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(faq.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
