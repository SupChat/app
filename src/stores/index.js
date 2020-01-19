import React from 'react';
import { MobXProviderContext, Provider } from 'mobx-react';
import { configure } from 'mobx';
import authStore from './auth'

configure({ enforceActions: 'observed' });

const stores = {
  authStore
};

function StoreProvider({ children }) {
  return (
    <Provider {...stores}>
      {children}
    </Provider>
  );
}

function useStores() {
  return React.useContext(MobXProviderContext);
}

export { StoreProvider, useStores }