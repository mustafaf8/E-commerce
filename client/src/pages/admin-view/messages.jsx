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

  useEffect(() => {
    dispatch(fetchAdminMessages(filter));
  }, [dispatch, filter]);

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

  return (
    <div className="p-4">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-gray-800">Müşteri Mesajları</h1>
        <p className="text-gray-500 mt-2">Müşteri mesajlarını görüntüleyin ve yanıtlayın</p>
      </div>
      <div className="mt-6 flex gap-2">
        {Object.entries(statusLabels).map(([key, label]) => (
          <Button
            key={key}
            variant={filter === key ? "default" : "outline"}
            onClick={() => dispatch(setFilter(key))}
          >
            {label}
          </Button>
        ))}
        <Button variant={!filter ? "default" : "outline"} onClick={() => dispatch(setFilter(""))}>
          Tümü
        </Button>
      </div>
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
          {loading ? (
            <div>Yükleniyor...</div>
          ) : messages.length === 0 ? (
            <div>Hiç mesaj yok.</div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 px-2">Kullanıcı</th>
                  <th className="text-left py-2 px-2">E-posta</th>
                  <th className="text-left py-2 px-2">Konu</th>
                  <th className="text-left py-2 px-2">Durum</th>
                  <th className="text-left py-2 px-2">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr
                    key={msg._id}
                    className="hover:bg-indigo-50 cursor-pointer"
                    onClick={() => openDetail(msg)}
                  >
                    <td className="py-2 px-2">{msg.name || msg.userId?.userName || "-"}</td>
                    <td className="py-2 px-2">{msg.email || msg.userId?.email || "-"}</td>
                    <td className="py-2 px-2 font-semibold">{msg.subject}</td>
                    <td className="py-2 px-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[msg.status]}`}>{statusLabels[msg.status]}</span>
                    </td>
                    <td className="py-2 px-2">{new Date(msg.createdAt).toLocaleString("tr-TR")}</td>
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
              <h2 className="text-xl font-bold mb-2">Konu: {selected.subject}</h2>
              <div className="mb-2 text-gray-700">{selected.message}</div>
              <div className="text-xs text-gray-400 mb-2">Gönderim: {new Date(selected.createdAt).toLocaleString("tr-TR")}</div>
              {selected.replies && selected.replies.length > 0 && (
                <div className="mb-4">
                  <div className="font-semibold text-indigo-700 mb-1">Yanıtlar</div>
                  <div className="space-y-2">
                    {selected.replies.map((rep, i) => (
                      <div key={i} className="bg-indigo-50 rounded p-2">
                        <div className="text-sm text-indigo-900">{rep.message}</div>
                        <div className="text-xs text-gray-400 mt-1">Yanıt: {new Date(rep.createdAt).toLocaleString("tr-TR")}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <textarea
                  className="w-full border rounded p-2"
                  rows={3}
                  placeholder="Yanıt yaz..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={handleReply} disabled={replyLoading || !reply.trim()}>
                    {replyLoading ? "Gönderiliyor..." : "Yanıtla"}
                  </Button>
                  {selected.status !== "read" && selected.status !== "replied" && (
                    <Button variant="outline" onClick={handleMarkRead}>Okundu olarak işaretle</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default MessagesPage; 