export interface ComponentEnhancer<TInner, TOutter> {
  (component: React.FC<TInner>): React.FC<TOutter>
}
