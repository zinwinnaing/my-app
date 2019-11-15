import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import _ from 'lodash';
import {
  MESSAGE_TYPE_LABEL,
  TOKEN_LABEL,
  // MESSAGE_CODE_LABEL,
} from '../variables/constants';
// import notification from '../utils/notification';
// import {
//   addNotification,
//   notifyOnError,
// } from '../services/notification/notificationAction';

const getHeader = () => {
  const token = localStorage.getItem(TOKEN_LABEL)
    ? localStorage.getItem(TOKEN_LABEL)
    : sessionStorage.getItem(TOKEN_LABEL);

  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return null;
};

const pending = (type, meta) => ({
  type,
  payload: null,
  meta: { isPending: true, ...meta },
});

const onSuccess = (
  dispatch,
  type,
  response,
  onSuccessCallback,
  meta,
  params
) => {
  const { data, headers } = response;
  if (headers[MESSAGE_TYPE_LABEL]) {
    // const msgCode = headers[MESSAGE_CODE_LABEL];
    // add Notfication Here
  }
  if (type) {
    dispatch({
      type,
      payload: data,
      meta: { headers, isPending: false, params, ...meta },
    });
  }

  if (typeof onSuccessCallback === 'function') {
    onSuccessCallback(response);
  }
};

const onError = (dispatch, type, error, onErrorCallback) => {
  if (_.has(error, 'response.status') && error.response.status === 401) {
    sessionStorage.removeItem(TOKEN_LABEL);
    localStorage.removeItem(TOKEN_LABEL);
    // window.location = LOGIN_URL;
  }
  // if (_.has(error, 'response.headers')) {
  //   if (error.response.headers[MESSAGE_TYPE_LABEL]) {
  //     dispatch(notifyOnError(error));

  //     // notifyOnError(error);
  //   }
  // }
  // dispatch(notifyOnError(error));
  if (type) {
    dispatch({ type, error: true });
  }
  if (typeof onErrorCallback === 'function') {
    onErrorCallback(error);
  }
};

function Api(dispatch) {
  if (typeof dispatch !== 'function') {
    throw Error('Please provide a valid dispatch.');
  }

  const that = this;
  that.config = {};
  that.config.dispatch = dispatch;

  // that.instance = _dispatch => new Api(_dispatch);

  Api.prototype.url = url => {
    that.config.url = url;
    return that;
  };

  Api.prototype.meta = meta => {
    that.config.meta = meta;
    return that;
  };

  Api.prototype.action = type => {
    that.config.actionType = type;
    return that;
  };

  Api.prototype.params = _params => {
    if (!isEmpty(_params)) {
      that.config.params = _params;
    }
    return that;
  };

  Api.prototype.data = data => {
    that.config.data = data;
    return that;
  };

  Api.prototype.headers = headers => {
    that.config.headers = headers;
    return that;
  };

  Api.prototype.onSuccess = onSuccessCallback => {
    that.config.onSuccessCallback = onSuccessCallback;
    return that;
  };

  Api.prototype.onError = onErrorCallback => {
    that.config.onErrorCallback = onErrorCallback;
    return that;
  };

  Api.prototype.post = async () => {
    dispatch(pending(that.config.actionType));
    try {
      const response = await axios.post(that.config.url, that.config.data, {
        headers: { ...getHeader(), ...that.config.headers },
        params: that.config.params,
      });
      onSuccess(
        that.config.dispatch,
        that.config.actionType,
        response,
        that.config.onSuccessCallback,
        that.config.meta,
        that.config.params
      );
    } catch (error) {
      onError(
        that.config.dispatch,
        that.config.actionType,
        error,
        that.config.onErrorCallback
      );
    }
  };

  Api.prototype.get = async () => {
    if (that.config.actionType) {
      dispatch(pending(that.config.actionType, that.config.meta));
    }
    try {
      const response = await axios.get(that.config.url, {
        headers: { ...getHeader(), ...that.config.headers },
        params: that.config.params || null,
      });
      onSuccess(
        that.config.dispatch,
        that.config.actionType,
        response,
        that.config.onSuccessCallback,
        that.config.meta,
        that.config.params
      );
    } catch (error) {
      onError(
        that.config.dispatch,
        that.config.actionType,
        error,
        that.config.onErrorCallback
      );
    }
  };

  Api.prototype.update = async () => {
    dispatch(pending(that.config.actionType));
    try {
      const response = await axios.put(that.config.url, that.config.data, {
        headers: { ...getHeader(), ...that.config.headers },
        params: that.config.params,
      });
      onSuccess(
        that.config.dispatch,
        that.config.actionType,
        response,
        that.config.onSuccessCallback,
        that.config.meta,
        that.config.params
      );
    } catch (error) {
      onError(
        that.config.dispatch,
        that.config.actionType,
        error,
        that.config.onErrorCallback
      );
    }
  };

  Api.prototype.delete = async () => {
    dispatch(pending(that.config.actionType));
    try {
      const response = await axios.delete(that.config.url, {
        headers: { ...getHeader(), ...that.config.headers },
        params: that.config.params || null,
      });
      onSuccess(
        that.config.dispatch,
        that.config.actionType,
        response,
        that.config.onSuccessCallback,
        that.config.meta,
        that.config.params
      );
    } catch (error) {
      onError(
        that.config.dispatch,
        that.config.actionType,
        error,
        that.config.onErrorCallback
      );
    }
  };
}

export default dispatch => new Api(dispatch);
