export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					operationName?: string;
					query?: string;
					variables?: Json;
					extensions?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	pgbouncer: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			get_auth: {
				Args: { p_usename: string };
				Returns: {
					username: string;
					password: string;
				}[];
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			messages: {
				Row: {
					available_at: string;
					content: string;
					created_at: string;
					encrypted: boolean;
					id: string;
					legacy_slug: string | null;
					owned_by: string | null;
				};
				Insert: {
					available_at?: string;
					content: string;
					created_at?: string;
					encrypted?: boolean;
					id?: string;
					legacy_slug?: string | null;
					owned_by?: string | null;
				};
				Update: {
					available_at?: string;
					content?: string;
					created_at?: string;
					encrypted?: boolean;
					id?: string;
					legacy_slug?: string | null;
					owned_by?: string | null;
				};
				Relationships: [];
			};
			subscriptions: {
				Row: {
					created_at: string;
					failed_attempts: number;
					id: string;
					message_id: string;
					success: boolean;
				};
				Insert: {
					created_at?: string;
					failed_attempts?: number;
					id?: string;
					message_id: string;
					success?: boolean;
				};
				Update: {
					created_at?: string;
					failed_attempts?: number;
					id?: string;
					message_id?: string;
					success?: boolean;
				};
				Relationships: [
					{
						foreignKeyName: 'subscriptions_message_id_fkey';
						columns: ['message_id'];
						referencedRelation: 'messages';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'subscriptions_message_id_fkey';
						columns: ['message_id'];
						referencedRelation: 'userview';
						referencedColumns: ['id'];
					}
				];
			};
			unsubscribe_tokens: {
				Row: {
					created_at: string;
					id: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					user_id?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			subscriptions_with_message_data: {
				Row: {
					available_at: string | null;
					email: string | null;
					failed_attempts: number | null;
					message_id: string | null;
					owned_by: string | null;
					subscription_id: string | null;
					success: boolean | null;
				};
				Relationships: [
					{
						foreignKeyName: 'subscriptions_message_id_fkey';
						columns: ['message_id'];
						referencedRelation: 'messages';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'subscriptions_message_id_fkey';
						columns: ['message_id'];
						referencedRelation: 'userview';
						referencedColumns: ['id'];
					}
				];
			};
			userview: {
				Row: {
					available_at: string | null;
					content: string | null;
					created_at: string | null;
					encrypted: boolean | null;
					id: string | null;
					legacy_slug: string | null;
					owned_by: string | null;
					sha256: string | null;
				};
				Insert: {
					available_at?: string | null;
					content?: never;
					created_at?: string | null;
					encrypted?: boolean | null;
					id?: string | null;
					legacy_slug?: string | null;
					owned_by?: string | null;
					sha256?: never;
				};
				Update: {
					available_at?: string | null;
					content?: never;
					created_at?: string | null;
					encrypted?: boolean | null;
					id?: string | null;
					legacy_slug?: string | null;
					owned_by?: string | null;
					sha256?: never;
				};
				Relationships: [];
			};
		};
		Functions: {
			process_subscriptions: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			send_reminder: {
				Args: { _subscription_id: string };
				Returns: undefined;
			};
			to_relative_time: {
				Args: { ts: string };
				Returns: string;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	storage: {
		Tables: {
			buckets: {
				Row: {
					allowed_mime_types: string[] | null;
					avif_autodetection: boolean | null;
					created_at: string | null;
					file_size_limit: number | null;
					id: string;
					name: string;
					owner: string | null;
					owner_id: string | null;
					public: boolean | null;
					updated_at: string | null;
				};
				Insert: {
					allowed_mime_types?: string[] | null;
					avif_autodetection?: boolean | null;
					created_at?: string | null;
					file_size_limit?: number | null;
					id: string;
					name: string;
					owner?: string | null;
					owner_id?: string | null;
					public?: boolean | null;
					updated_at?: string | null;
				};
				Update: {
					allowed_mime_types?: string[] | null;
					avif_autodetection?: boolean | null;
					created_at?: string | null;
					file_size_limit?: number | null;
					id?: string;
					name?: string;
					owner?: string | null;
					owner_id?: string | null;
					public?: boolean | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			migrations: {
				Row: {
					executed_at: string | null;
					hash: string;
					id: number;
					name: string;
				};
				Insert: {
					executed_at?: string | null;
					hash: string;
					id: number;
					name: string;
				};
				Update: {
					executed_at?: string | null;
					hash?: string;
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			objects: {
				Row: {
					bucket_id: string | null;
					created_at: string | null;
					id: string;
					last_accessed_at: string | null;
					metadata: Json | null;
					name: string | null;
					owner: string | null;
					owner_id: string | null;
					path_tokens: string[] | null;
					updated_at: string | null;
					user_metadata: Json | null;
					version: string | null;
				};
				Insert: {
					bucket_id?: string | null;
					created_at?: string | null;
					id?: string;
					last_accessed_at?: string | null;
					metadata?: Json | null;
					name?: string | null;
					owner?: string | null;
					owner_id?: string | null;
					path_tokens?: string[] | null;
					updated_at?: string | null;
					user_metadata?: Json | null;
					version?: string | null;
				};
				Update: {
					bucket_id?: string | null;
					created_at?: string | null;
					id?: string;
					last_accessed_at?: string | null;
					metadata?: Json | null;
					name?: string | null;
					owner?: string | null;
					owner_id?: string | null;
					path_tokens?: string[] | null;
					updated_at?: string | null;
					user_metadata?: Json | null;
					version?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'objects_bucketId_fkey';
						columns: ['bucket_id'];
						referencedRelation: 'buckets';
						referencedColumns: ['id'];
					}
				];
			};
			s3_multipart_uploads: {
				Row: {
					bucket_id: string;
					created_at: string;
					id: string;
					in_progress_size: number;
					key: string;
					owner_id: string | null;
					upload_signature: string;
					user_metadata: Json | null;
					version: string;
				};
				Insert: {
					bucket_id: string;
					created_at?: string;
					id: string;
					in_progress_size?: number;
					key: string;
					owner_id?: string | null;
					upload_signature: string;
					user_metadata?: Json | null;
					version: string;
				};
				Update: {
					bucket_id?: string;
					created_at?: string;
					id?: string;
					in_progress_size?: number;
					key?: string;
					owner_id?: string | null;
					upload_signature?: string;
					user_metadata?: Json | null;
					version?: string;
				};
				Relationships: [
					{
						foreignKeyName: 's3_multipart_uploads_bucket_id_fkey';
						columns: ['bucket_id'];
						referencedRelation: 'buckets';
						referencedColumns: ['id'];
					}
				];
			};
			s3_multipart_uploads_parts: {
				Row: {
					bucket_id: string;
					created_at: string;
					etag: string;
					id: string;
					key: string;
					owner_id: string | null;
					part_number: number;
					size: number;
					upload_id: string;
					version: string;
				};
				Insert: {
					bucket_id: string;
					created_at?: string;
					etag: string;
					id?: string;
					key: string;
					owner_id?: string | null;
					part_number: number;
					size?: number;
					upload_id: string;
					version: string;
				};
				Update: {
					bucket_id?: string;
					created_at?: string;
					etag?: string;
					id?: string;
					key?: string;
					owner_id?: string | null;
					part_number?: number;
					size?: number;
					upload_id?: string;
					version?: string;
				};
				Relationships: [
					{
						foreignKeyName: 's3_multipart_uploads_parts_bucket_id_fkey';
						columns: ['bucket_id'];
						referencedRelation: 'buckets';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 's3_multipart_uploads_parts_upload_id_fkey';
						columns: ['upload_id'];
						referencedRelation: 's3_multipart_uploads';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			can_insert_object: {
				Args: { bucketid: string; name: string; owner: string; metadata: Json };
				Returns: undefined;
			};
			extension: {
				Args: { name: string };
				Returns: string;
			};
			filename: {
				Args: { name: string };
				Returns: string;
			};
			foldername: {
				Args: { name: string };
				Returns: string[];
			};
			get_size_by_bucket: {
				Args: Record<PropertyKey, never>;
				Returns: {
					size: number;
					bucket_id: string;
				}[];
			};
			list_multipart_uploads_with_delimiter: {
				Args: {
					bucket_id: string;
					prefix_param: string;
					delimiter_param: string;
					max_keys?: number;
					next_key_token?: string;
					next_upload_token?: string;
				};
				Returns: {
					key: string;
					id: string;
					created_at: string;
				}[];
			};
			list_objects_with_delimiter: {
				Args: {
					bucket_id: string;
					prefix_param: string;
					delimiter_param: string;
					max_keys?: number;
					start_after?: string;
					next_token?: string;
				};
				Returns: {
					name: string;
					id: string;
					metadata: Json;
					updated_at: string;
				}[];
			};
			operation: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			search: {
				Args: {
					prefix: string;
					bucketname: string;
					limits?: number;
					levels?: number;
					offsets?: number;
					search?: string;
					sortcolumn?: string;
					sortorder?: string;
				};
				Returns: {
					name: string;
					id: string;
					updated_at: string;
					created_at: string;
					last_accessed_at: string;
					metadata: Json;
				}[];
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
				Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
			Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
		: never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
		? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema['CompositeTypes']
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
		? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	graphql_public: {
		Enums: {}
	},
	pgbouncer: {
		Enums: {}
	},
	public: {
		Enums: {}
	},
	storage: {
		Enums: {}
	}
} as const;
