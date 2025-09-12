import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import api from '../../utils/axios';
import type { Follower, FollowerInput } from '../../types/follower';
import FollowerForm from './components/FollowerForm';

export default function FollowersView() {
  const [rows, setRows] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Follower | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Follower[]>('/followers');
      setRows(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load followers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (f: Follower) => { setEditing(f); setDialogOpen(true); };
  const closeDialog = () => { if (!submitting) setDialogOpen(false); };

  const handleSubmit = async (values: FollowerInput) => {
    try {
      setSubmitting(true);
      if (editing) {
        await api.put(`/followers/${editing._id}`, values);
      } else {
        await api.post('/followers', values);
      }
      await load();
      setDialogOpen(false);
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Request failed');
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this follower?')) return;
    try {
      await api.delete(`/followers/${id}`);
      setRows((prev) => prev.filter((r) => r._id !== id));
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Delete failed');
    }
  };

  const title = useMemo(() => (editing ? 'Edit Follower' : 'New Follower'), [editing]);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>FOLLOWERS</Typography>
        <Typography variant="h4" sx={{ mt: 1, fontWeight: 800 }}>Webhook Followers</Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
          Manage follower endpoints that receive trade events.
        </Typography>
      </Box>

      <Card>
        <CardActions sx={{ justifyContent: 'flex-end', px: 2, pt: 2 }}>
          <Button variant="contained" onClick={openCreate}>Add Follower</Button>
        </CardActions>
        <CardContent>
          {loading ? (
            <Typography variant="body2" sx={{ opacity: 0.8 }}>Loading…</Typography>
          ) : error ? (
            <Typography color="error" variant="body2">{error}</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Base URL</TableCell>
                  <TableCell>Expire (s)</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r._id} hover>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.baseUrl}</TableCell>
                    <TableCell>{r.expire}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" size="small" onClick={() => openEdit(r)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton color="error" size="small" onClick={() => remove(r._id)}>
                        <DeleteOutlineOutlinedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <FollowerForm
            defaults={editing || undefined}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </DialogContent>
      </Dialog>
    </Stack>
  );
}

