export interface UploadResponse {
  success: boolean;
  template_id: string;
  title: string;
  doc_type?: string;
  filename?: string;
  template?: string;
  variables: Array<{
    key: string;
    label: string;
    description: string;
    example: string;
    required: boolean;
    dtype?: string;
  }>;
  watermark?: string;
}

