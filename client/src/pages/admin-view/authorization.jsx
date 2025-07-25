import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminList,
  updateAdminAuthorization,
} from "@/store/admin/authorization-slice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Loader2, User, Shield, Eye, Settings, Save, CheckCircle2 } from "lucide-react";

const MODULES = [
  { id: "dashboard", label: "Banner", icon: "📊", color: "bg-blue-500" },
  { id: "products", label: "Ürünler", icon: "📦", color: "bg-green-500" },
  { id: "orders", label: "Siparişler", icon: "🛍️", color: "bg-orange-500" },
  { id: "brands", label: "Markalar", icon: "🏷️", color: "bg-purple-500" },
  { id: "categories", label: "Kategoriler", icon: "📁", color: "bg-indigo-500" },
  { id: "home-sections", label: "AnaSayfa", icon: "🏠", color: "bg-pink-500" },
  { id: "stats", label: "İstatistikler", icon: "📈", color: "bg-teal-500" },
  { id: "users", label: "Kullanıcılar", icon: "👥", color: "bg-sky-500" },
  { id: "coupons", label: "Kuponlar", icon: "🏷️", color: "bg-amber-600" },
];

const ACCESS_LEVELS = {
  1: { label: "Tam Yetki", color: "bg-red-500", description: "Tüm modüllere tam erişim" },
  2: { label: "Orta Yetki", color: "bg-yellow-500", description: "Belirli modüllere erişim" },
  3: { label: "Sınırlı Yetki", color: "bg-green-500", description: "Sadece görüntüleme" },
};

function AuthorizationPage() {
  const dispatch = useDispatch();
  const { adminList: rawAdminList, isLoading, isUpdating } = useSelector(
    (state) => state.adminAuthorization
  );

  const [localData, setLocalData] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Load admin list
  useEffect(() => {
    dispatch(fetchAdminList());
  }, [dispatch]);

  useEffect(() => {
    // Filter out Level 1 admins from list
    const filtered = (rawAdminList || []).filter(
      (admin) => admin.adminAccessLevel !== 1 && admin.adminAccessLevel !== undefined
    );
    setLocalData(filtered);
    if (filtered.length > 0 && !selectedAdmin) {
      setSelectedAdmin(filtered[0]);
    }
  }, [rawAdminList]);

  const handleLevelChange = (adminId, newLevel) => {
    setLocalData((prev) =>
      prev.map((a) =>
        a._id === adminId ? { ...a, adminAccessLevel: Number(newLevel) } : a
      )
    );
    if (selectedAdmin?._id === adminId) {
      setSelectedAdmin(prev => ({ ...prev, adminAccessLevel: Number(newLevel) }));
    }
  };

  const handleModuleToggle = (adminId, moduleId, field, value) => {
    setLocalData((prev) =>
      prev.map((a) => {
        if (a._id !== adminId) return a;
        const permissions = { ...(a.adminModulePermissions || {}) };
        const modulePerm = permissions[moduleId] || { view: false, manage: false };
        permissions[moduleId] = { ...modulePerm, [field]: value };
        return { ...a, adminModulePermissions: permissions };
      })
    );
    
    if (selectedAdmin?._id === adminId) {
      setSelectedAdmin(prev => {
        const permissions = { ...(prev.adminModulePermissions || {}) };
        const modulePerm = permissions[moduleId] || { view: false, manage: false };
        permissions[moduleId] = { ...modulePerm, [field]: value };
        return { ...prev, adminModulePermissions: permissions };
      });
    }
  };

  const handleSave = (admin) => {
    const { _id, adminAccessLevel, adminModulePermissions } = admin;
    dispatch(updateAdminAuthorization({
      adminId: _id,
      updateData: { adminAccessLevel, adminModulePermissions },
    }));
  };

  const getModulePermissions = (admin, moduleId) => {
    return admin?.adminModulePermissions?.[moduleId] || { view: false, manage: false };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
          <p className="text-muted-foreground">Yetkilendirmeler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-h-screen overflow-hidden">
      

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Admin List - Sol Panel */}
        <div className="w-80 flex-shrink-0">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Admin Kullanıcıları</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto p-4">
                {localData.map((admin) => (
                  <div
                    key={admin._id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedAdmin?._id === admin._id
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedAdmin(admin)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 bg-gradient-to-br from-primary to-primary/80 text-white">
                        <div className="flex items-center justify-center w-full h-full text-sm font-medium">
                          {admin.userName?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{admin.userName}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs text-white ${ACCESS_LEVELS[admin.adminAccessLevel]?.color || 'bg-gray-500'}`}
                          >
                            {ACCESS_LEVELS[admin.adminAccessLevel]?.label || 'Bilinmiyor'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {localData.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Henüz admin kullanıcısı bulunmuyor</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Permission Details - Sağ Panel */}
        <div className="flex-1 min-w-0">
          {selectedAdmin ? (
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 bg-gradient-to-br from-primary to-primary/80 text-white">
                      <div className="flex items-center justify-center w-full h-full text-lg font-medium">
                        {selectedAdmin.userName?.charAt(0)?.toUpperCase() || 'A'}
                      </div>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{selectedAdmin.userName}</CardTitle>
                      <p className="text-muted-foreground text-sm">
                        {ACCESS_LEVELS[selectedAdmin.adminAccessLevel]?.description || 'Yetki açıklaması bulunamadı'}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleSave(selectedAdmin)}
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Değişiklikleri Kaydet
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Access Level Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Yetki Seviyesi</span>
                  </label>
                  <Select
                    value={String(selectedAdmin.adminAccessLevel || 3)}
                    onValueChange={(val) => handleLevelChange(selectedAdmin._id, val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span>Seviye 1 - Tam Yetki</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="2">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <span>Seviye 2 - Orta Yetki</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="3">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span>Seviye 3 - Sınırlı Yetki</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Module Permissions */}
                <div className="space-y-4">
                  <label className="text-sm font-medium flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Modül İzinleri</span>
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                    {MODULES.map((module) => {
                      const permissions = getModulePermissions(selectedAdmin, module.id);
                      return (
                        <Card key={module.id} className="relative overflow-hidden">
                          <div className={`absolute left-0 top-0 w-1 h-full ${module.color}`}></div>
                          <CardContent className="p-4 pl-6">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="text-2xl">{module.icon}</div>
                                <div>
                                  <h4 className="font-medium text-sm">{module.label}</h4>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">Görüntüleme</span>
                                </div>
                                <Switch
                                  checked={permissions.view}
                                  onCheckedChange={(val) =>
                                    handleModuleToggle(selectedAdmin._id, module.id, "view", val)
                                  }
                                />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Settings className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">Yönetim</span>
                                </div>
                                <Switch
                                  checked={permissions.manage}
                                  onCheckedChange={(val) =>
                                    handleModuleToggle(selectedAdmin._id, module.id, "manage", val)
                                  }
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">Admin Seçin</h3>
                <p className="text-muted-foreground">
                  Sol panelden bir admin kullanıcısı seçerek yetki ayarlarını düzenleyebilirsiniz.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthorizationPage; 