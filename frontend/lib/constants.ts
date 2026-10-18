export const TOAST_STYLE = {
  style: {
    background: '#13221C',
    color: '#ffffff',
    border: '1px solid rgba(74, 222, 128, 0.2)',
    fontSize: '12px',
    borderRadius: '8px',
  },
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'pec_summit_access_token',
  AUTH_USER: 'pec_summit_auth_user',
  REGISTRATIONS: 'pec_summit_registrations',
  PASS_APPLICATIONS: 'pec_user_pass_applications',
  MY_PLAN: 'pec_summit_my_plan',
  SUBSCRIBERS: 'pec_summit_subscribers',
  DISMISSED_ANNOUNCEMENT: 'pec_summit_dismissed_announcement',
  DELETED_PASS_IDS: 'pec_summit_deleted_pass_ids',
  ATTENDEE_PROFILE: 'pec_summit_attendee_profile',
  CHECKOUT_DRAFT: 'pec_checkout_draft',
} as const;