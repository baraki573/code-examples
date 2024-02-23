import { animate, state, style, transition, trigger } from "@angular/animations";

export const selectedBorderAnimation = trigger('selectedBorder', [
    state('true', style({boxShadow: '0.25rem 0 white inset'})),
    state('false', style({boxShadow: 'none'})),
    transition('false <=> true', animate('350ms'))
  ]
);
