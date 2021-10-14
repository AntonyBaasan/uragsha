import { Injectable, OnDestroy } from '@angular/core';
import { UserCallMetadata, WorkoutStateEnum } from '../models';

@Injectable()
export class CallPageService implements OnDestroy {

  ngOnDestroy(): void {
    console.log('ngOnDestroy: CallPageService.');
  }

  createDefaltUserSetting(userId: string, userName: string) {
    var defaultSetting: UserCallMetadata = {
      uiLayout: {
        optionValues: {
          isFit: false,
          isMute: false,
        },
        position: 'right',
        visibleButtons: {
          muteMic: true,
          muteAudio: true,
          fit: true,
          options: true,
          leave: true,
        }
      },
      userInfo: {
        userId: userId,
        userName: userName,
      },
      workoutState: {
        isLocal: true,
        state: WorkoutStateEnum.planning,
        workout: {
          title: 'new workout',
          exercises: []
        }
      }
    };
    //debug:
    defaultSetting.workoutState.workout = {
      title: 'new workout',
      exercises: [
        { title: 'warmpup', seconds: 30 },
        { title: 'push ups', seconds: 60 },
        { title: 'burpee', seconds: 60 },
      ]
    }
    return defaultSetting;
  }

  createDefaltRemoteUserSetting(): UserCallMetadata {
    const remoteUserSetting: UserCallMetadata = {
      uiLayout: {
        optionValues: {
          isFit: false,
          isMute: false,
        },
        position: 'left',
        visibleButtons: {
          muteMic: false,
          muteAudio: false,
          fit: true,
          options: false,
          leave: false,
        }
      },
      userInfo: {
        userId: '',
        userName: '',
      },
      workoutState: {
        isLocal: false,
        state: WorkoutStateEnum.planning,
        workout: {
          title: 'new workout',
          exercises: []
        }
      }
    };

    //debug:
    remoteUserSetting.workoutState.workout = {
      title: 'new workout',
      exercises: [
        { title: 'remote user', seconds: 120 },
        { title: 'push ups', seconds: 60 },
        { title: 'burpee', seconds: 60 },
      ]
    }

    return remoteUserSetting;
  }
}
