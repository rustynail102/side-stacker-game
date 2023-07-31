import { ButtonVariant } from "@client/components/atoms/Button/@types/Button"
import { Button } from "@client/components/atoms/Button/Button"
import { AlertType } from "@client/components/molecules/Alert/@types/Alert"
import { Alert } from "@client/components/molecules/Alert/Alert"
import { ErrorTemplate } from "@client/components/templates/ErrorTemplate/ErrorTemplate"
import { QueryErrorResetBoundary } from "@tanstack/react-query"
import React from "react"
import { ErrorBoundary } from "react-error-boundary"
import { IconType } from "react-icons"
import { FiAlertCircle } from "react-icons/fi"

/**
 * Higher-order component that provides error boundary functionality to the wrapped component.
 * It uses QueryErrorResetBoundary and react-error-boundary's ErrorBoundary.
 * @param {React.FC<Record<string, unknown>>} WrappedComponent - The component to wrap with an error boundary.
 * @returns {React.FC<Record<string, unknown>>} - The component wrapped with an error boundary.
 */
export const withErrorBoundary =
  (WrappedComponent: React.FC<Record<string, unknown>>) =>
  (props: Record<string, unknown>) => (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorTemplate>
              <Alert icon={FiAlertCircle as IconType} type={AlertType.Error}>
                It seems that something went wrong.{" "}
                {error instanceof Error ? error?.message : ""}
              </Alert>
              <Button
                ariaLabel="Reload the application"
                onClick={resetErrorBoundary}
                variant={ButtonVariant.Warning}
              >
                Reload the application
              </Button>
            </ErrorTemplate>
          )}
        >
          <WrappedComponent {...props} />
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
