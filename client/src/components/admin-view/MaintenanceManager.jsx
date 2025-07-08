import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateMaintenanceStatus } from "@/store/common-slice/maintenance-slice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import PropTypes from 'prop-types';

function MaintenanceManager({ canManage }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { status, isLoading } = useSelector((state) => state.maintenance);

  const [localStatus, setLocalStatus] = useState({
    isActive: false,
    message: "",
    returnDate: "",
  });

  useEffect(() => {
    if (status) {
      setLocalStatus({
        isActive: status.isActive || false,
        message: status.message || "",
        returnDate: status.returnDate
          ? new Date(status.returnDate).toISOString().slice(0, 16)
          : "",
      });
    }
  }, [status]);

  const handleSave = () => {
    if (!canManage) {
      toast({
        title: "Yetkiniz Yok",
        description: "Bu ayarları değiştirme yetkiniz bulunmamaktadır.",
        variant: "destructive",
      });
      return;
    }
    const dataToSend = {
      isActive: localStatus.isActive,
      message: localStatus.message,
      returnDate: localStatus.returnDate
        ? new Date(localStatus.returnDate).toISOString()
        : null,
    };

    dispatch(updateMaintenanceStatus(dataToSend))
      .unwrap()
      .then(() => {
        toast({ title: "Bakım modu durumu güncellendi.", variant: "success" });
      })
      .catch((err) => {
        toast({
          title: "Güncelleme başarısız.",
          description: err.message,
          variant: "destructive",
        });
      });
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Site Bakım Modu</CardTitle>
        <CardDescription>
          Bakım modunu aktif ederek siteyi geçici olarak kapatabilirsiniz.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4 rounded-lg border p-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {localStatus.isActive ? "Bakım Modu Aktif" : "Bakım Modu Pasif"}
            </p>
            <p className="text-sm text-muted-foreground">
              {localStatus.isActive
                ? "Site şu anda ziyaretçilere kapalı."
                : "Site şu anda yayında."}
            </p>
          </div>
          <Switch
            checked={localStatus.isActive}
            onCheckedChange={(checked) =>
              setLocalStatus((prev) => ({ ...prev, isActive: checked }))
            }
            disabled={!canManage}
            aria-readonly
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maintenance-message">Bakım Mesajı</Label>
          <Textarea
            id="maintenance-message"
            placeholder="Sitede görüntülenecek mesaj..."
            value={localStatus.message}
            onChange={(e) =>
              setLocalStatus((prev) => ({ ...prev, message: e.target.value }))
            }
            disabled={!canManage}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="return-date">
            Tahmini Geri Dönüş Tarihi (Opsiyonel)
          </Label>
          <Input
            id="return-date"
            type="datetime-local"
            value={localStatus.returnDate}
            onChange={(e) =>
              setLocalStatus((prev) => ({
                ...prev,
                returnDate: e.target.value,
              }))
            }
            disabled={!canManage}
          />
        </div>

        <Button onClick={handleSave} disabled={isLoading || !canManage}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Değişiklikleri Kaydet
        </Button>
      </CardContent>
    </Card>
  );
}
MaintenanceManager.propTypes = {
  canManage: PropTypes.bool.isRequired,
};

export default MaintenanceManager;
