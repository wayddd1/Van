import { Dialog, DialogActions, DialogTitle, Button } from '@mui/material';

export default function DeleteConfirmationModal({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Are you sure you want to delete this van?</DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error">Delete</Button>
      </DialogActions>
    </Dialog>
  );
}