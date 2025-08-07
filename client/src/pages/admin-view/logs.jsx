import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogs } from "@/store/admin/logSlice";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import tr from "date-fns/locale/tr";
import { setLogPage } from "@/store/admin/logSlice";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const levelColor = {
  info: "default",
  error: "destructive",
  warn: "secondary",
  debug: "outline",
};

const LogsPage = () => {
  const dispatch = useDispatch();
  const { logs, loading, error, pagination } = useSelector(
    (state) => state.logs
  );

  useEffect(() => {
    dispatch(fetchLogs({ page: pagination.currentPage, limit: 20 }));
  }, [dispatch, pagination.currentPage]);

  // Debug: Log verilerini kontrol et
  useEffect(() => {
    if (logs && logs.length > 0) {
      console.log("=== FRONTEND LOG DEBUG ===");
      console.log("Toplam log sayısı:", logs.length);
      console.log(
        "İlk 3 log detayları:",
        logs.slice(0, 3).map((log) => ({
          id: log.id,
          message: log.message,
          username: log.username,
          user: log.user,
          action: log.action,
          level: log.level,
        }))
      );
      console.log("==========================");
    }
  }, [logs]);

  // Logları en yeni tarihten en eskiye doğru sırala
  const sortedLogs = logs
    ? [...logs].sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return dateB - dateA; // En yeni tarih önce
      })
    : [];

  // Kullanıcı adını güvenli şekilde al
  const getUsernameDisplay = (log) => {
    // Önce doğrudan username alanına bak
    if (log.username) {
      return log.username;
    }

    // Sonra user objesine bak
    if (log.user && typeof log.user === "object") {
      return log.user.username || log.user.email || "Bilinmeyen";
    }

    // Son olarak string olarak user alanına bak
    if (log.user && typeof log.user === "string") {
      return log.user;
    }

    return "Sistem";
  };

  // Action display fonksiyonu
  const getActionDisplay = (log) => {
    if (log.action) {
      // Action kodlarını daha okunabilir hale getir
      const actionMap = {
        VIEW_LOGS: "Log Görüntüle",
        VIEW_LOG_STATS: "İstatistik Görüntüle",
        LOGIN: "Giriş",
        LOGOUT: "Çıkış",
        CREATE_USER: "Kullanıcı Oluştur",
        UPDATE_USER: "Kullanıcı Güncelle",
        DELETE_USER: "Kullanıcı Sil",
      };

      return actionMap[log.action] || log.action;
    }
    return "-";
  };

  return (
    <div className="p-4">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-gray-800">Log Kayıtları</h1>
        <p className="text-gray-500 mt-2">
          Sistem log kayıtlarını görüntüleyin ve yönetin
        </p>
      </div>
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <div className="flex flex-col gap-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
              <div className="flex justify-center mt-4">
                <Loader2 className="animate-spin text-gray-400" size={32} />
              </div>
            </div>
          ) : error ? (
            <div className="text-red-500 bg-red-50 p-4 rounded-lg border border-red-200">
              <strong>Hata:</strong> {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">Tarih</TableHead>
                    <TableHead className="w-[80px]">Seviye</TableHead>
                    <TableHead className="w-[120px]">Kullanıcı</TableHead>
                    <TableHead className="w-[120px]">İşlem</TableHead>
                    <TableHead>Mesaj</TableHead>
                    <TableHead className="w-[200px]">Detaylar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedLogs && sortedLogs.length > 0 ? (
                    sortedLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-gray-50">
                        <TableCell className="text-xs">
                          {log.timestamp
                            ? format(
                                new Date(log.timestamp),
                                "dd.MM.yyyy HH:mm",
                                { locale: tr }
                              )
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={levelColor[log.level] || "default"}>
                            {log.level?.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {getUsernameDisplay(log)}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            {getActionDisplay(log)}
                          </span>
                        </TableCell>
                        <TableCell
                          className="max-w-xs truncate"
                          title={log.message}
                        >
                          {log.message || "-"}
                        </TableCell>
                        <TableCell>
                          <details className="text-xs">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                              Detayları Göster
                            </summary>
                            <pre className="whitespace-pre-wrap break-all text-xs bg-gray-50 rounded p-2 mt-2 max-h-32 overflow-y-auto">
                              {JSON.stringify(
                                {
                                  ipAddress: log.ipAddress,
                                  resourceId: log.resourceId,
                                  resourceType: log.resourceType,
                                  userAgent: log.userAgent
                                    ? log.userAgent.substring(0, 50) + "..."
                                    : undefined,
                                  additionalData: log.additionalData,
                                },
                                null,
                                2
                              )}
                            </pre>
                          </details>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-gray-400 py-8"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <span>Kayıt bulunamadı.</span>
                          <button
                            onClick={() =>
                              dispatch(fetchLogs({ page: 1, limit: 20 }))
                            }
                            className="text-blue-600 hover:text-blue-800 text-sm underline"
                          >
                            Yeniden Yükle
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {pagination && pagination.totalLogs > 0 && (
                <div className="flex items-center justify-center space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      dispatch(setLogPage(pagination.currentPage - 1))
                    }
                    disabled={!pagination.hasPrevPage || loading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Önceki
                  </Button>
                  <span className="text-sm text-gray-500">
                    Sayfa {pagination.currentPage} / {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      dispatch(setLogPage(pagination.currentPage + 1))
                    }
                    disabled={!pagination.hasNextPage || loading}
                  >
                    Sonraki
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sayfalama bilgisi */}
        {pagination && pagination.totalLogs > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            Toplam {pagination.totalLogs} kayıt bulundu (Sayfa{" "}
            {pagination.currentPage} / {pagination.totalPages})
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsPage;
