import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminMessages,
  setSelectedMessage,
  setFilter,
  replyToMessage,
  updateMessageStatus,
} from "@/store/admin/adminMessageSlice";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import useAdminPermission from "@/hooks/useAdminPermission";
import { Inbox, MessageCircle, Check, Clock } from "lucide-react";

const statusLabels = {
  new: "Yeni",
  read: "Okundu",
  replied: "Yanıtlandı",
};
const statusColors = {
  new: "bg-gray-200 text-gray-700",
  read: "bg-yellow-100 text-yellow-700",
  replied: "bg-green-100 text-green-700",
};

const MessagesPage = () => {
  const dispatch = useDispatch();
  const { messages, loading, selected, filter } = useSelector((s) => s.adminMessages);
  const [modalOpen, setModalOpen] = useState(false);
  const [reply, setReply] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const { toast } = useToast();
  const canView = useAdminPermission('messages');
  const canManage = useAdminPermission('messages', 'manage');

  useEffect(() => {
    if (canView) {
      dispatch(fetchAdminMessages(filter));
    }
  }, [dispatch, filter, canView]);

  const openDetail = (msg) => {
    dispatch(setSelectedMessage(msg));
    setReply("");
    setModalOpen(true);
  };
  const closeDetail = () => {
    dispatch(setSelectedMessage(null));
    setModalOpen(false);
  };

  const handleReply = async () => {
    if (!reply.trim()) return;
    setReplyLoading(true);
    try {
      await dispatch(replyToMessage({ id: selected._id, reply })).unwrap();
      toast({ title: "Yanıt gönderildi!", variant: "success" });
      setReply("");
      dispatch(fetchAdminMessages(filter));
      closeDetail();
    } catch (err) {
      toast({ title: "Yanıt gönderilemedi!", variant: "destructive" });
    } finally {
      setReplyLoading(false);
    }
  };

  const handleMarkRead = async () => {
    try {
      await dispatch(updateMessageStatus({ id: selected._id, status: "read" })).unwrap();
      toast({ title: "Mesaj okundu olarak işaretlendi!", variant: "success" });
      dispatch(fetchAdminMessages(filter));
      closeDetail();
    } catch (err) {
      toast({ title: "Durum güncellenemedi!", variant: "destructive" });
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
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <MessageCircle className="h-8 w-8 text-primary" />
          Müşteri Mesajları
        </h1>
        <p className="text-gray-500 mt-2">Müşteri mesajlarını görüntüleyin ve yanıtlayın</p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button 
          variant={!filter ? "default" : "outline"}
          onClick={() => dispatch(setFilter(""))}
          className="flex items-center gap-1"
          aria-label="Tümü"
        >
          <Inbox className="h-4 w-4" />
          Tümü
        </Button>
        <Button
          key="new"
          variant={filter === "new" ? "default" : "outline"}
          onClick={() => dispatch(setFilter("new"))}
          className="flex items-center gap-1"
          aria-label="Yeni"
        >
          <Clock className="h-4 w-4" />
          {statusLabels.new}
        </Button>
        <Button
          key="read"
          variant={filter === "read" ? "default" : "outline"}
          onClick={() => dispatch(setFilter("read"))}
          className="flex items-center gap-1"
          aria-label="Okundu"
        >
          <Check className="h-4 w-4" />
          {statusLabels.read}
        </Button>
        <Button
          key="replied"
          variant={filter === "replied" ? "default" : "outline"}
          onClick={() => dispatch(setFilter("replied"))}
          className="flex items-center gap-1"
          aria-label="Yanıtlandı"
        >
          <MessageCircle className="h-4 w-4" />
          {statusLabels.replied}
        </Button>
      </div>
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-gray-500">Yükleniyor...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Bu filtreye ait mesaj bulunamadı.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-posta</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Konu</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.map((msg) => (
                  <tr
                    key={msg._id}
                    className="hover:bg-blue-50 cursor-pointer transition-colors duration-150 ease-in-out"
                    onClick={() => openDetail(msg)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{msg.name || msg.userId?.userName || "-"}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{msg.email || msg.userId?.email || "-"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{msg.subject}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[msg.status]}`}>
                        {statusLabels[msg.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(msg.createdAt).toLocaleString("tr-TR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        {selected && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={closeDetail}>&times;</button>
              <div className="flex items-center mb-4">
                <MessageCircle className="h-5 w-5 text-primary mr-2" />
                <h2 className="text-xl font-bold">Konu: {selected.subject}</h2>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg mb-4 text-gray-700">{selected.message}</div>
              <div className="flex justify-between text-xs text-gray-500 mb-4">
                <span>Gönderen: {selected.name || selected.userId?.userName || "-"}</span>
                <span>Gönderim: {new Date(selected.createdAt).toLocaleString("tr-TR")}</span>
              </div>
              {selected.replies && selected.replies.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center font-semibold text-primary mb-2">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span>Yanıtlar ({selected.replies.length})</span>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selected.replies.map((rep, i) => (
                      <div key={i} className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                        <div className="text-sm text-gray-700">{rep.message}</div>
                        <div className="text-xs text-gray-500 mt-1 text-right">
                          {new Date(rep.createdAt).toLocaleString("tr-TR")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {canManage && (
                <div className="flex flex-col gap-2">
                  <textarea
                    className="w-full border rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    placeholder="Yanıt yaz..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <div className="flex gap-2 justify-end">
                    {selected.status !== "read" && selected.status !== "replied" && (
                      <Button variant="outline" onClick={handleMarkRead} className="flex items-center gap-1">
                        <Check className="h-4 w-4" />
                        Okundu olarak işaretle
                      </Button>
                    )}
                    <Button 
                      onClick={handleReply} 
                      disabled={replyLoading || !reply.trim()}
                      className="flex items-center gap-1"
                      aria-label="Yanıtla"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {replyLoading ? "Gönderiliyor..." : "Yanıtla"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default MessagesPage; 