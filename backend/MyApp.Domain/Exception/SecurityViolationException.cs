using System;

namespace MyApp.Domain.Exceptions
{
    public sealed class SecurityViolationException : Exception
    {
        public SecurityViolationException(string message)
            : base(message)
        {
        }
    }
}

