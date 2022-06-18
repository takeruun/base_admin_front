import { Box, Container } from '@mui/material';
import ReceiptPreviewContent from 'src/components/Order/ReceiptPreviewContent';

const ReceiptPreview = () => {
  return (
    <Container>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <ReceiptPreviewContent />
      </Box>
    </Container>
  );
};

export default ReceiptPreview;
