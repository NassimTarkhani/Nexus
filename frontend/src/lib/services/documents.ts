// Documents Service
import { supabase } from '../supabase';
import type { Database } from '../supabase';

type Document = Database['public']['Tables']['documents']['Row'];
type DocumentInsert = Database['public']['Tables']['documents']['Insert'];
type DocumentUpdate = Database['public']['Tables']['documents']['Update'];
type DocumentChunk = Database['public']['Tables']['document_chunks']['Row'];

export const documentsService = {
    // Get all documents for user
    async getDocuments(userId: string): Promise<Document[]> {
        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            if (error.code === '42P01' || error.message?.includes('does not exist')) {
                console.warn('⚠️ documents table not found. Run DATABASE_DOCUMENTS.sql in Supabase.');
                return [];
            }
            throw error;
        }
        return data || [];
    },

    // Get document by ID
    async getDocumentById(id: string): Promise<Document | null> {
        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        return data;
    },

    // Create document record
    async createDocument(doc: DocumentInsert): Promise<Document> {
        const { data, error } = await supabase
            .from('documents')
            .insert(doc)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Update document
    async updateDocument(id: string, updates: DocumentUpdate): Promise<Document> {
        const { data, error } = await supabase
            .from('documents')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete document (chunks cascade)
    async deleteDocument(id: string): Promise<void> {
        const { error } = await supabase
            .from('documents')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Get chunks for a document
    async getChunks(documentId: string): Promise<DocumentChunk[]> {
        const { data, error } = await supabase
            .from('document_chunks')
            .select('*')
            .eq('document_id', documentId)
            .order('chunk_index', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    // Insert chunks for a document
    async insertChunks(chunks: Array<Omit<DocumentChunk, 'id' | 'created_at'>>): Promise<void> {
        const { error } = await supabase
            .from('document_chunks')
            .insert(chunks);

        if (error) throw error;
    },

    // Search chunks by simple text match (MVP — replace with pgvector later)
    async searchChunks(documentId: string, query: string, limit = 5): Promise<DocumentChunk[]> {
        const { data, error } = await supabase
            .from('document_chunks')
            .select('*')
            .eq('document_id', documentId)
            .ilike('content', `%${query}%`)
            .order('chunk_index', { ascending: true })
            .limit(limit);

        if (error) throw error;
        return data || [];
    },
};
