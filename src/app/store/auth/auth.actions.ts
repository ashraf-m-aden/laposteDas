import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type {
  ApiError,
  AuthSession,
  Credentials,
  HistoryItem,
  ProfilePayload,
  RegisterPayload,
  UserAccount,
} from '../../core/models';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Restore Session': emptyProps(),
    Login: props<{ credentials: Credentials }>(),
    'Login Success': props<{ session: AuthSession }>(),
    'Login Failure': props<{ error: ApiError }>(),
    Register: props<{ payload: RegisterPayload }>(),
    'Register Success': props<{ session: AuthSession }>(),
    'Register Failure': props<{ error: ApiError }>(),
    'Load Profile': emptyProps(),
    'Load Profile Success': props<{ user: UserAccount }>(),
    'Load Profile Failure': props<{ error: ApiError }>(),
    'Update Profile': props<{ payload: ProfilePayload }>(),
    'Update Profile Success': props<{ user: UserAccount }>(),
    'Update Profile Failure': props<{ error: ApiError }>(),
    'Load History': emptyProps(),
    'Load History Success': props<{ items: HistoryItem[] }>(),
    'Load History Failure': props<{ error: ApiError }>(),
    Logout: emptyProps(),
    'Logout Success': emptyProps(),
  },
});
