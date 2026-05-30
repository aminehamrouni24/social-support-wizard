import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  Alert,
} from '@mui/material';
import { Close, Refresh, Check, Edit, Cancel } from '@mui/icons-material';
import { useAIGeneration } from '../../hooks/useAIGeneration';

interface AIModalProps {
  open: boolean;
  onClose: () => void;
  field: 'financialSituation' | 'employmentCircumstances' | 'reasonForApplying';
  onAccept: (text: string) => void;
}

const AIModal: React.FC<AIModalProps> = ({ open, onClose, field, onAccept }) => {
  const { t, i18n } = useTranslation();
  const { loading, error, generatedText, generateText, cancelGeneration, resetGeneration, retry } =
    useAIGeneration();

  const [guideline, setGuideline] = useState<string>('');
  const [editableText, setEditableText] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const isRtl = i18n.language === 'ar';

  // Keep editable text synced with generated content
  useEffect(() => {
    if (generatedText) {
      setEditableText(generatedText);
    }
  }, [generatedText]);

  // Reset internal states on open/close
  useEffect(() => {
    if (open) {
      setGuideline('');
      setIsEditing(false);
      resetGeneration();
    }
  }, [open, resetGeneration]);

  const handleGenerate = async () => {
    await generateText(field, guideline);
  };

  const handleAccept = () => {
    onAccept(editableText);
    onClose();
  };

  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose} // Prevent close during generation unless explicitly cancelled
      maxWidth="sm"
      fullWidth
      sx={{ direction: isRtl ? 'rtl' : 'ltr' }}
      aria-labelledby="ai-modal-title"
    >
      <DialogTitle id="ai-modal-title" sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
          {t('ai.modalTitle')}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={loading ? cancelGeneration : onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('ai.modalDesc')}
        </Typography>

        {/* Input prompt guidelines if not generated yet */}
        {!generatedText && !loading && !error && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              {t('ai.promptLabel')}
            </Typography>
            <TextField
              autoFocus
              placeholder={t('ai.promptPlaceholder')}
              fullWidth
              multiline
              rows={3}
              value={guideline}
              onChange={(e) => setGuideline(e.target.value)}
              slotProps={{
                htmlInput: {
                  maxLength: 250,
                }
              }}
            />
          </Box>
        )}

        {/* Loading state with cancel support */}
        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              {t('ai.generating')}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={cancelGeneration}
              sx={{ mt: 2 }}
            >
              {t('ai.discardBtn')}
            </Button>
          </Box>
        )}

        {/* Error state with retry */}
        {error && !loading && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {t('ai.errorMsg')}
            </Alert>
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={retry}
                startIcon={<Refresh />}
              >
                {t('ai.retryBtn')}
              </Button>
              <Button variant="outlined" onClick={onClose}>
                {t('buttons.back')}
              </Button>
            </Box>
          </Box>
        )}

        {/* Success generated state */}
        {generatedText && !loading && !error && (
          <Box sx={{ mt: 1 }}>
            {isEditing ? (
              <TextField
                fullWidth
                multiline
                rows={6}
                value={editableText}
                onChange={(e) => setEditableText(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
                slotProps={{
                  htmlInput: {
                    maxLength: 2000,
                  }
                }}
              />
            ) : (
              <Box
                sx={{
                  p: 2,
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100'),
                  borderRadius: 1,
                  mb: 2,
                  whiteSpace: 'pre-line',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="body1">{editableText}</Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="success"
                onClick={handleAccept}
                startIcon={<Check />}
              >
                {t('ai.acceptBtn')}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleToggleEdit}
                startIcon={isEditing ? <Cancel /> : <Edit />}
              >
                {isEditing ? t('ai.discardBtn') : t('ai.editBtn')}
              </Button>
              <Button variant="text" color="error" onClick={resetGeneration}>
                {t('ai.discardBtn')}
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, px: 3 }}>
        {!generatedText && !loading && !error && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerate}
            disabled={loading}
            fullWidth
            sx={{ fontWeight: 'bold', py: 1 }}
          >
            {t('ai.generateBtn')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AIModal;
