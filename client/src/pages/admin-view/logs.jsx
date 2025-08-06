import React, { useEffect } from "react";
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

const levelColor = {
  info: "default",
  error: "destructive",
  warn: "secondary",
  debug: "outline",
};

const LogsPage = () => {
  const dispatch = useDispatch();
  const { logs, loading, error, pagination } = useSelector((state) => state.logs);

  useEffect(() => {
    dispatch(fetchLogs({ page: pagination.currentPage, limit: 20 }));
  }, [dispatch, pagination.currentPage]);

  // Debug: Log verilerini kontrol et
  useEffect(() => {
    if (logs && logs.length > 0) {
      console.log("=== LOG DEBUG ===");
      console.log("Toplam log sayısı:", logs.length);
      console.log("İlk log:", logs[0]);
      console.log("İlk log kullanıcı bilgisi:", logs[0]?.user);
      console.log("İlk log meta bilgisi:", logs[0]?.meta);

      // Tüm logları kontrol et
      logs.forEach((log, index) => {
        if (log.user) {
          console.log(`Log ${index} - Kullanıcı:`, log.user);
        }
        if (log.meta?.username) {
          console.log(`Log ${index} - Meta Username:`, log.meta.username);
        }
      });

      console.log("==================");
    }
  }, [logs]);

  // Logları en yeni tarihten en eskiye doğru sırala
  const sortedLogs = logs ? [...logs].sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return dateB - dateA; // En yeni tarih önce
  }) : [];

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
            <div className="text-red-500">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Seviye</TableHead>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>Mesaj</TableHead>
                  <TableHead>Detaylar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLogs && sortedLogs.length > 0 ? (
                  sortedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {log.timestamp
                          ? format(new Date(log.timestamp), "dd.MM.yyyy HH:mm", { locale: tr })
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={levelColor[log.level] || "default"}>
                          {log.level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {log.user?.username || log.username || log.user?.email || log.meta?.username || "-"}
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={log.message}>
                        {log.message}
                      </TableCell>
                      <TableCell>
                        <pre className="whitespace-pre-wrap break-all text-xs bg-gray-50 rounded p-2 max-w-xs overflow-x-auto">
                          {JSON.stringify(
                            {
                              action: log.action,
                              ipAddress: log.ipAddress,
                              resourceId: log.resourceId,
                              resourceType: log.resourceType,
                              // additionalData'yı da ekleyelim (varsa)
                              ...(log.additionalData || {}),
                            },
                            null,
                            2
                          )}
                        </pre>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-400">
                      Kayıt bulunamadı.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        {/* Sayfalama ve filtreleme için ileri seviye hazırlık alanı */}
      </div>
    </div>
  );
};

export default LogsPage; 