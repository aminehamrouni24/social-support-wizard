import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import { Close, DeleteSweep, ContentCopy } from '@mui/icons-material';
import { useWizard } from '../../context/WizardContext';

interface AIHistoryPanelProps {
  open: boolean;
  onClose: () => void;
}

const AIHistoryPanel: React.FC<AIHistoryPanelProps> = ({ open, onClose }) => {
  const { t, i18n } = useTranslation();
  const { state, clearAIHistory } = useWizard();

  const isRtl = i18n.language === 'ar';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Drawer
      anchor={isRtl ? 'left' : 'right'}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { width: { xs: '100%', sm: 360 }, p: 3 }
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {t('ai.historyTitle')}
        </Typography>
        <IconButton onClick={onClose} edge="end" aria-label="close">
          <Close />
        </IconButton>
      </Box>

      {state.aiHistory.length > 0 && (
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteSweep />}
          onClick={clearAIHistory}
          sx={{ mb: 3 }}
        >
          {t('ai.discardBtn')} All
        </Button>
      )}

      <Divider />

      {state.aiHistory.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary" variant="body2">
            {t('ai.noHistory')}
          </Typography>
        </Box>
      ) : (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {state.aiHistory.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="copy"
                    onClick={() => handleCopy(item.generatedText)}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                }
                sx={{ px: 0, py: 2 }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {t(`situation.${item.field}`)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.timestamp}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontStyle: 'italic', mb: 1, display: 'block' }}
                      >
                        Guideline: "{item.prompt}"
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{
                          p: 1,
                          bgcolor: 'action.hover',
                          borderRadius: 1,
                          fontSize: '0.825rem',
                          maxHeight: 120,
                          overflowY: 'auto',
                        }}
                      >
                        {item.generatedText}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <Divider variant="fullWidth" component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Drawer>
  );
};

export default AIHistoryPanel;
