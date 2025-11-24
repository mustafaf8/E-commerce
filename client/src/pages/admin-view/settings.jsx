import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAdminPermission from "@/hooks/useAdminPermission";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import ConfirmationModal from "@/components/admin-view/ConfirmationModal";
import {
  fetchPaymentAgents,
  addPaymentAgent,
  updatePaymentAgentStatus,
  deletePaymentAgent,
} from "@/store/admin/paymentAgentSlice";
import { Trash2 } from "lucide-react";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const canView = useAdminPermission("settings");
  const canManage = useAdminPermission("settings", "manage");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingAgentId, setDeletingAgentId] = useState(null);

  const {
    agents,
    loading,
    createLoading,
    updateLoading,
    deleteLoading,
  } = useSelector((state) => state.paymentAgents || {});

  useEffect(() => {
    if (canView) {
      dispatch(fetchPaymentAgents());
    }
  }, [dispatch, canView]);

  const resetForm = () => {
    setFormValues({ userName: "", email: "", password: "" });
  };

  const handleCreateAgent = async (event) => {
    event.preventDefault();
    if (!canManage) {
      toast({ variant: "destructive", title: "Bu işlem için yetkiniz yok." });
      return;
    }

    try {
      await dispatch(addPaymentAgent(formValues)).unwrap();
      toast({ title: "Kasiyer oluşturuldu.", variant: "success" });
      resetForm();
      setDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Kasiyer oluşturulamadı.",
        description: error,
      });
    }
  };

  const handleStatusToggle = async (agent) => {
    if (!canManage) {
      toast({ variant: "destructive", title: "Bu işlem için yetkiniz yok." });
      return;
    }

    setStatusUpdatingId(agent._id);
    try {
      await dispatch(
        updatePaymentAgentStatus({
          agentId: agent._id,
          isActive: !agent.isActive,
        })
      ).unwrap();
      toast({
        title: `${agent.userName} ${
          agent.isActive ? "pasif" : "aktif"
        } duruma alındı.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Durum güncellenemedi.",
        description: error,
      });
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const agentList = useMemo(() => agents || [], [agents]);

  const handleDeleteClick = (agent) => {
    if (!canManage) {
      toast({ variant: "destructive", title: "Bu işlem için yetkiniz yok." });
      return;
    }
    setDeletingAgentId(agent._id);
    setOpenDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeletingAgentId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAgentId) return;
    setDeletingId(deletingAgentId);
    try {
      await dispatch(deletePaymentAgent({ agentId: deletingAgentId })).unwrap();
      toast({ title: "Personel başarıyla silindi.", variant: "success" });
      closeDeleteDialog();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Personel silinemedi.",
        description: error,
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (!canView) {
    return (
      <div className="p-4 text-center bg-red-50 text-red-700 rounded-md">
        Bu sayfayı görüntüleme yetkiniz yok.
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Personel / Kasiyer Yönetimi
        </h1>
        <p className="text-gray-500 mt-2">
          Ödeme temsilcilerini oluşturun, durumlarını yönetin.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Kasiyer Listesi
            </h2>
            <p className="text-sm text-gray-500">
              Aktif/pasif durumunu değiştirebilir veya hesapları silebilirsiniz.
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)} disabled={!canManage}>
            Yeni Kasiyer Ekle
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Kasiyerler</CardTitle>
            <CardDescription>
              {loading ? "Yükleniyor..." : "Toplam kasiyer sayısı: " + agentList.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İsim</TableHead>
                  <TableHead>E-posta</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!loading && agentList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      Henüz kasiyer eklenmemiş.
                    </TableCell>
                  </TableRow>
                )}
                {agentList.map((agent) => (
                  <TableRow key={agent._id}>
                    <TableCell className="font-medium">
                      {agent.userName}
                    </TableCell>
                    <TableCell>{agent.email}</TableCell>
                    <TableCell>
                      <span
                        className={`text-sm font-medium ${
                          agent.isActive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {agent.isActive ? "Aktif" : "Pasif"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-3">
                      <Switch
                        checked={agent.isActive}
                        disabled={
                          !canManage ||
                          updateLoading ||
                          statusUpdatingId === agent._id
                        }
                        onCheckedChange={() => handleStatusToggle(agent)}
                        aria-label="Aktif/Pasif"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(agent)}
                        disabled={
                          !canManage ||
                          deleteLoading ||
                          deletingId === agent._id
                        }
                        aria-label="Sil"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Sil
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Kasiyer Ekle</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleCreateAgent}>
            <div>
              <Label htmlFor="agent-name">İsim</Label>
              <Input
                id="agent-name"
                value={formValues.userName}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    userName: e.target.value,
                  }))
                }
                required
                placeholder="Örn: Ahmet Kaya"
              />
            </div>
            <div>
              <Label htmlFor="agent-email">E-posta</Label>
              <Input
                id="agent-email"
                type="email"
                value={formValues.email}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                required
                placeholder="agent@example.com"
              />
            </div>
            <div>
              <Label htmlFor="agent-password">Şifre</Label>
              <Input
                id="agent-password"
                type="password"
                value={formValues.password}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                required
                minLength={6}
                placeholder="Güçlü bir şifre girin"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setDialogOpen(false);
                }}
              >
                İptal
              </Button>
              <Button type="submit" disabled={!canManage || createLoading}>
                {createLoading ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        isOpen={openDeleteDialog}
        message="Bu personeli silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        onCancel={closeDeleteDialog}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default SettingsPage;