import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { toast } from "../../components/ui/use-toast";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import axiosInstance from "../../api/axiosInstance";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import ConfirmationModal from "../../components/admin-view/ConfirmationModal";
import { Search, Crown, Shield, XCircle, Calendar, UserCog, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Skeleton } from "../../components/ui/skeleton";

// Giriş yöntemi için icon ve renk seçenekleri
const authProviderConfig = {
  local: { label: "E-posta", icon: <UserCog size={14} />, color: "bg-blue-100 text-blue-800" },
  google: { label: "Google", icon: <i className="text-xs">G</i>, color: "bg-red-100 text-red-800" },
  github: { label: "GitHub", icon: <i className="text-xs">GH</i>, color: "bg-gray-100 text-gray-800" },
  facebook: { label: "Facebook", icon: <i className="text-xs">FB</i>, color: "bg-blue-100 text-blue-800" },
  twitter: { label: "Twitter", icon: <i className="text-xs">X</i>, color: "bg-black text-white" },
};

// Tarihi formatla
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Geçersiz tarih";
    }
    return format(date, "d MMMM yyyy", { locale: tr });
  } catch (error) {
    console.error("Tarih formatlanırken hata:", error);
    return "Geçersiz tarih";
  }
};

// Giriş yöntemi için badge bileşeni
const AuthProviderBadge = ({ provider }) => {
  const config = authProviderConfig[provider] || { 
    label: provider || "Bilinmiyor", 
    icon: <UserCog size={14} />, 
    color: "bg-gray-100 text-gray-800" 
  };
  
  return (
    <Badge className={`${config.color} flex items-center gap-1 capitalize`}>
      {config.icon}
      <span>{config.label}</span>
    </Badge>
  );
};

// TableSkeleton bileşeni
const TableSkeleton = ({ colCount = 6, rowCount = 3 }) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {Array(colCount).fill(0).map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-6 w-full" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array(rowCount).fill(0).map((_, i) => (
            <TableRow key={i}>
              {Array(colCount).fill(0).map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const UsersPage = () => {
  const [adminUsers, setAdminUsers] = useState([]);
  const [regularUsers, setRegularUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [action, setAction] = useState(null); 

  // Kullanıcıları getir
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [adminsRes, regularRes] = await Promise.all([
        axiosInstance.get('/admin/users/admins'),
        axiosInstance.get('/admin/users/regular')
      ]);
      
      setAdminUsers(adminsRes.data.data);
      setRegularUsers(regularRes.data.data);
    } catch (error) {
      console.error("Kullanıcılar getirilemedi:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Kullanıcılar yüklenirken bir sorun oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Admin yapma işlemi
  const handleMakeAdmin = async (userId) => {
    setActionLoading(true);
    try {
      const response = await axiosInstance.put(`/admin/users/make-admin/${userId}`);
      
      // Başarılı ise kullanıcı listelerini güncelle
      if (response.data.success) {
        // Kullanıcıyı düzenli kullanıcılar listesinden kaldır
        const updatedUser = response.data.data;
        setRegularUsers(prev => prev.filter(user => user._id !== userId));
        
        // Kullanıcıyı admin listesine ekle
        setAdminUsers(prev => [...prev, updatedUser]);
        
        toast({
          title: "İşlem Başarılı",
          description: "Kullanıcı başarıyla admin yapıldı.",
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Admin yapma işlemi başarısız:", error);
      toast({
        variant: "destructive",
        title: "İşlem Başarısız",
        description: error.response?.data?.message || "Admin yapma işlemi başarısız oldu.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Admin yetkisi kaldırma işlemi
  const handleRemoveAdmin = async (userId) => {
    setActionLoading(true);
    try {
      const response = await axiosInstance.put(`/admin/users/remove-admin/${userId}`);
      
      // Başarılı ise kullanıcı listelerini güncelle
      if (response.data.success) {
        // Kullanıcıyı admin listesinden kaldır
        const updatedUser = response.data.data;
        setAdminUsers(prev => prev.filter(user => user._id !== userId));
        
        // Kullanıcıyı düzenli kullanıcılar listesine ekle
        setRegularUsers(prev => [...prev, updatedUser]);
        
        toast({
          title: "İşlem Başarılı",
          description: "Kullanıcının admin yetkisi başarıyla kaldırıldı.",
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Admin yetkisi kaldırma işlemi başarısız:", error);
      toast({
        variant: "destructive",
        title: "İşlem Başarısız",
        description: error.response?.data?.message || "Admin yetkisi kaldırma işlemi başarısız oldu.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Modal onaylama işlemini yönet
  const handleConfirm = () => {
    if (action === 'makeAdmin' && selectedUser) {
      handleMakeAdmin(selectedUser._id);
    } else if (action === 'removeAdmin' && selectedUser) {
      handleRemoveAdmin(selectedUser._id);
    }
    setIsConfirmModalOpen(false);
    setSelectedUser(null);
    setAction(null);
  };

  // Admin yap butonuna tıklandığında
  const onMakeAdminClick = (user) => {
    setSelectedUser(user);
    setAction('makeAdmin');
    setIsConfirmModalOpen(true);
  };

  // Yetkiyi kaldır butonuna tıklandığında
  const onRemoveAdminClick = (user) => {
    setSelectedUser(user);
    setAction('removeAdmin');
    setIsConfirmModalOpen(true);
  };

  // Arama filtreleme işlevi
  const filteredAdminUsers = adminUsers.filter(user => 
    user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredRegularUsers = regularUsers.filter(user => 
    user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4 space-y-8">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-gray-800">Kullanıcı Yönetimi</h1>
        <p className="text-gray-500 mt-2">
          Tüm kullanıcıları görüntüleyin, yönetin ve rol atamaları yapın
        </p>
      </div>
      
      {/* Arama Çubuğu */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Kullanıcı adı veya e-posta ile ara..."
          className="pl-10 py-5 border-gray-200 focus:border-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Admin Kullanıcılar Tablosu */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Crown size={20} className="text-amber-500" />
            <span>Yöneticiler ({filteredAdminUsers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton colCount={6} rowCount={3} />
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Adı Soyadı</TableHead>
                    <TableHead>E-posta</TableHead>
                    <TableHead>Kayıt Tarihi</TableHead>
                    <TableHead>Giriş Yöntemi</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdminUsers.length > 0 ? (
                    filteredAdminUsers.map((user) => (
                      <TableRow key={user._id} className="hover:bg-gray-50/50 h-8">
                        <TableCell className="font-medium py-1">{user.userName}</TableCell>
                        <TableCell className="py-1">{user.email || "-"}</TableCell>
                        <TableCell className="whitespace-nowrap py-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar size={14} className="text-gray-500" />
                            {formatDate(user.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell className="py-1">
                          <AuthProviderBadge provider={user.authProvider} />
                        </TableCell>
                        <TableCell className="py-1">
                          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                            Admin
                          </Badge>
                        </TableCell>
                        <TableCell className="py-1">
                          {user.adminAccessLevel === 1 ? (
                            <div className="h-8 max-w-[106px] px-3 py-1 border border-green-400 rounded-md bg-gray-50 text-green-600 text-sm font-medium flex items-center justify-center">
                              Tam Yetki
                            </div>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 flex items-center gap-1 py-1"
                              onClick={() => onRemoveAdminClick(user)}
                              disabled={actionLoading}
                              aria-label="Yetkiyi Al"
                            >
                              {actionLoading && selectedUser?._id === user._id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <XCircle size={14} />
                              )}
                              Yetkiyi Al
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-2 text-gray-500">
                        {searchTerm ? "Aranan kritere uygun yönetici bulunamadı." : "Hiç yönetici bulunamadı."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Standart Kullanıcılar Tablosu */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Shield size={20} className="text-blue-500" />
            <span>Standart Kullanıcılar ({filteredRegularUsers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton colCount={6} rowCount={5} />
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Adı Soyadı</TableHead>
                    <TableHead>E-posta</TableHead>
                    <TableHead>Kayıt Tarihi</TableHead>
                    <TableHead>Giriş Yöntemi</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegularUsers.length > 0 ? (
                    filteredRegularUsers.map((user) => (
                      <TableRow key={user._id} className="hover:bg-gray-50/50 h-8">
                        <TableCell className="font-medium py-1">{user.userName}</TableCell>
                        <TableCell className="py-1">{user.email || "-"}</TableCell>
                        <TableCell className="whitespace-nowrap py-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar size={14} className="text-gray-500" />
                            {formatDate(user.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell className="py-1">
                          <AuthProviderBadge provider={user.authProvider} />
                        </TableCell>
                        <TableCell className="py-1">
                          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                            Kullanıcı
                          </Badge>
                        </TableCell>
                        <TableCell className="py-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-1 py-1"
                            onClick={() => onMakeAdminClick(user)}
                            disabled={actionLoading}
                            aria-label="Admin Yap"
                          >
                            {actionLoading && selectedUser?._id === user._id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Crown size={14} />
                            )}
                            Admin Yap
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-2 text-gray-500">
                        {searchTerm ? "Aranan kritere uygun kullanıcı bulunamadı." : "Hiç kullanıcı bulunamadı."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
             {/* Onay Modali */}
       <ConfirmationModal
         isOpen={isConfirmModalOpen}
         message={
           action === 'makeAdmin'
             ? `${selectedUser?.userName} kullanıcısını admin yapmak istediğinizden emin misiniz?`
             : `${selectedUser?.userName} kullanıcısının admin yetkisini kaldırmak istediğinizden emin misiniz?`
         }
         onConfirm={handleConfirm}
         onCancel={() => {
           setIsConfirmModalOpen(false);
           setSelectedUser(null);
           setAction(null);
         }}
       />
    </div>
  );
};

export default UsersPage; 